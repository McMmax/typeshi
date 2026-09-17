export interface BlogPost {
  slug: string
  title: string
  date: string
  author: {
    name: string
    handle: string
    role: string
    avatar: string
  }
  tags: string[]
  readTime: string
  summary: string
  content: string
  featured?: boolean
}

export const posts: BlogPost[] = [
  {
    slug: 'replacing-redis-and-mongodb-with-spacetimedb-streaming-reducers',
    title: 'Why I Replaced Redis & MongoDB with SpacetimeDB Real-Time Streaming Reducers',
    date: '2026.09.17',
    author: {
      name: 'Max (McMmax)',
      handle: 'McMmax',
      role: 'Systems Architect & Security Researcher',
      avatar: 'https://avatars.githubusercontent.com/u/156390123?v=4',
    },
    tags: ['spacetimedb','architecture','systems'],
    readTime: '8 min read',
    featured: true,
    summary:
      'How I completely eliminated the fragile Redis cache-aside layer, Mongo document sprawl, and async writeback race conditions by executing deterministic Rust/WASM streaming reducers directly inside memory-resident relational state.',
    content: `
<p class="lead">
If you have ever built a high-concurrency multiplayer platform or low-latency simulation engine, you know the conventional industry dogma: put an in-memory cache like <strong>Redis</strong> in front of your service, back it with a document or SQL store like <strong>MongoDB</strong> or <strong>PostgreSQL</strong>, stitch them together with asynchronous message queues like <strong>Kafka</strong> or Redis Streams, and pray your cache invalidation logic doesn't tear your application apart.
</p>

<p>
After years of debugging race conditions, desynchronized inventories, dual-write split-brain anomalies, and multi-millisecond network hops in production, I tore that entire multi-tier stack out. In our network architecture, traditional databases have been completely replaced with <strong>SpacetimeDB</strong> running real-time streaming WebAssembly reducers.
</p>

<p>
Here is an architectural post-mortem on why traditional databases fail under real-time constraints, and how streaming reducers fundamentally altered how we synchronize state across our distributed fleet.
</p>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>1. The Triple-Tier Database Trap</h2>

<p>
Consider what happens when a player performs an action in a high-frequency simulation (such as transferring an enchanted sword between a chest and an inventory, taking knockback from an arrow, or updating an economy balance). In the traditional architecture:
</p>

<pre><code class="language-text">┌────────────────┐      RESP      ┌───────────────┐     Write-Back    ┌─────────────────┐
│   Game Server  │ ─────────────► │  Redis Cache  │ ────────────────► │  MongoDB / SQL  │
│   (Java / Go)  │ ◄───────────── │  (In-Memory)  │                   │  (Durable Disk) │
└────────────────┘   Round-trip   └───────┬───────┘                   └─────────────────┘
        │                                 │
        ▼                                 ▼
   Kafka / Redis Streams (Pub/Sub) ──────── Event Bus to Fleet Gateways
</code></pre>

<p>
This design introduces five fatal vulnerabilities:
</p>

<ul>
  <li>
    <strong>Dual-Write Incoherence & Cache Invalidation:</strong> A write to Redis succeeds, but the asynchronous persistence worker to MongoDB dies or times out. Redis now contains phantom state that never persisted to disk. Under server failure or network partitions, state rolls back to an arbitrary checkpoint, creating classic "item duping" or "balance rollback" exploits.
  </li>
  <li>
    <strong>BSON Document Race Conditions:</strong> Storing player profiles and inventories as massive nested BSON documents (e.g., <code>profile.inventories[].slots[]</code>) means any concurrent modification requires complex array filters or whole-document overwrites. Two concurrent actions across different instances overwrite each other's changes.
  </li>
  <li>
    <strong>The Serialization Tax:</strong> Every single state transition requires serializing Java/Go structs into RESP strings, deserializing on the Redis end, re-serializing into BSON/JSON for MongoDB, and parsing it back out. At 200Hz scheduling cadences, serialization alone accounts for upwards of <strong>35% of total CPU time</strong> and triggers catastrophic GC pauses.
  </li>
  <li>
    <strong>Fail-Open Seams in Anticheat & Security:</strong> If an external database query experiences jitter (e.g., a 40ms tail-latency spike), the game engine must choose between blocking the game tick thread (inducing server lag) or failing open (allowing the action without confirmation). Cheaters deliberately exploit this boundary by inducing network bursts to bypass security checks.
  </li>
</ul>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>2. The Paradigm Inversion: The Database IS the Server</h2>

<p>
SpacetimeDB inverts the entire relationship between compute and storage. Instead of deploying an application server that queries a distant database over a network socket, <strong>the database engine itself executes your application logic</strong>.
</p>

<p>
You write your business logic as deterministic <strong>reducers</strong> in Rust. SpacetimeDB compiles your code into WebAssembly and executes it directly inside the memory space of the relational table store.
</p>

<pre><code class="language-rust">#[spacetimedb::reducer]
pub fn transfer_item(
    ctx: &amp;ReducerContext,
    source_slot_id: u64,
    dest_slot_id: u64,
) -&gt; Result&lt;(), String&gt; {
    // 1. Fetch source slot via indexed B-tree lookup (sub-microsecond)
    let mut source = InventorySlot::filter_by_slot_id(&amp;source_slot_id)
        .ok_or("Source slot does not exist")?;

    // 2. Security validation: caller must own the container
    let container = Container::filter_by_container_id(&amp;source.container_id)
        .ok_or("Container not found")?;
    if container.owner_spacetime_id != ctx.sender_id {
        return Err("Permission denied: unauthorized container access".into());
    }

    // 3. Atomically reassign slot reference
    let mut dest = InventorySlot::filter_by_slot_id(&amp;dest_slot_id)
        .ok_or("Destination slot does not exist")?;

    let moved_item_id = source.item_instance_id;
    source.item_instance_id = None;
    dest.item_instance_id = Some(moved_item_id);

    InventorySlot::update_by_slot_id(&amp;source_slot_id, source);
    InventorySlot::update_by_slot_id(&amp;dest_slot_id, dest);

    Ok(())
}
</code></pre>

<h3>The Single Deterministic Transaction Lane</h3>
<p>
Reducers execute in a single-threaded deterministic WASM runtime. Because the tables reside directly in physical RAM within the same process, transaction execution is measured in <strong>microseconds</strong>, capable of processing over <strong>250,000 transactions per second</strong> on bare-metal hardware.
</p>

<p>
More importantly: <strong>every reducer is an atomic ACID transaction</strong>. If any validation check fails or an error is returned, the entire transaction rolls back instantly. There is no such thing as a partial commit, no dangling lock, and no desynchronized cache. It is architecturally fail-closed.
</p>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>3. Eradicating Message Brokers: Transient Event Tables</h2>

<p>
In a distributed gaming network, servers constantly emit high-frequency ephemeral telemetry: combat knockback vectors, damage calculations, line-of-sight raycasts, and anticheat suspicion signals.
</p>

<p>
In the old world, routing these required deploying a dedicated Kafka or Redis Streams cluster. You had to configure consumer groups, manage offsets, and write background garbage collectors to trim expired stream keys before memory exhausted.
</p>

<p>
In SpacetimeDB, we completely replaced Redis Streams using <strong>Transient Event Tables</strong>:
</p>

<pre><code class="language-rust">#[spacetimedb::table(name = knockback_event, public, event)]
pub struct KnockbackEvent {
    #[primary_key]
    pub event_id: u64,
    pub target_spacetime_id: u64,
    pub impulse_x: f32,
    pub impulse_y: f32,
    pub impulse_z: f32,
    pub timestamp_us: u64,
}
</code></pre>

<h3>How Real-Time Streaming Reducers Work:</h3>
<ol>
  <li><strong>Insert during Reducer:</strong> When combat logic resolves in a reducer, it inserts a row into the <code>knockback_event</code> table.</li>
  <li><strong>Streaming Binary SATN Wire Synchronization:</strong> The SpacetimeDB engine immediately computes the binary diff and broadcasts the row delta over WebSockets via Binary SATN (BSATN) to all subscribed game nodes (proxies, edge gateways, visualizers).</li>
  <li><strong>Automatic Transaction Evaporation:</strong> Because the table is marked <code>event</code>, <strong>the row is automatically deleted from memory upon transaction commit</strong>.</li>
</ol>

<p>
Zero bytes are written to persistent disk commitlogs. Zero unpruned rows accumulate in memory. Connected clients receive the live delta within microseconds of transaction execution, with zero message broker infrastructure.
</p>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>4. Partitioned 200Hz Scheduling: Taming the Global Tick</h2>

<p>
When we initially upgraded from legacy databases to SpacetimeDB 2.5, we made a classic novice mistake: we registered a single global scheduled reducer, <code>world_tick()</code>, that ran every 50ms and iterated across all online players in the database.
</p>

<p>
As our concurrent player count grew past 500, that single reducer began taking &gt;25ms to execute. Because SpacetimeDB guarantees strict serial execution, that one global loop occupied over 50% of the single WASM transaction lane, stalling incoming combat and movement reducers.
</p>

<h3>The Solution: Partitioned Scheduled Instance Rows</h3>
<p>
We restructured our tick model into <strong>Partitioned Regional Schedulers</strong>:
</p>

<ul>
  <li>Instead of one global loop, every distinct game region, arena, or prison mine instance registers its own independent scheduled row in a <code>scheduled_instance_tick</code> table.</li>
  <li>Each scheduled reducer queries <em>strictly</em> indexed sub-trees (e.g. <code>.filter_by_region(region_id)</code>) via in-memory B-tree indexes.</li>
  <li>Transactions run in parallel chunks, keeping every individual scheduled reducer execution under <strong>15 microseconds</strong>.</li>
</ul>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>5. Hot vs. Cold Domain Segmentation</h2>

<p>
To prevent high-frequency combat telemetry from interfering with durable player accounts, we segregated our database into strict operational domains:
</p>

<table>
  <thead>
    <tr>
      <th>Module</th>
      <th>Update Cadence</th>
      <th>Key Responsibilities</th>
      <th>Storage Lifecycle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong><code>stdb-hot</code></strong></td>
      <td>200Hz Scheduler / 20Hz Tick</td>
      <td>Continuous collision detection (swept AABB), player velocity vectors, knockback impulses, Polar 16³ voxel collision sections.</td>
      <td>In-Memory / Ephemeral Event Tables. Bounded RAM footprint.</td>
    </tr>
    <tr>
      <td><strong><code>stdb-cold</code></strong></td>
      <td>Event-Driven / Transactional</td>
      <td>Player identities, profiles, sequential u64 spacetime_id, RBAC permission nodes, disciplinary logs, and economic balances.</td>
      <td>Append-Only Durable CommitLog with strict zero-loss guarantees.</td>
    </tr>
    <tr>
      <td><strong><code>stdb-inventory</code></strong></td>
      <td>Transactional</td>
      <td>Fully normalized relational slots (-1..40, 100+), item instances, enchantment arrays, container transfer verification.</td>
      <td>Relational ACID persistence with zero duplication vulnerability.</td>
    </tr>
  </tbody>
</table>

<h3>Sequential u64 IDs vs. 128-bit UUIDs</h3>
<p>
One of our biggest wins was eliminating Mojang 128-bit UUIDs as database keys. High-frequency random UUIDs fragment B-tree index pages and wreck CPU L1/L2 cache lines. We mapped all incoming identities at the network gateway to a sequential <code>u64 spacetime_id</code>. Index lookups became single-cycle pointer offsets.
</p>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>6. Relational Inventories: Eliminating Item Duplication</h2>

<p>
In Minecraft server development, item duplication bugs have plagued servers for fifteen years. Almost every dupe stems from the same architectural flaw: <strong>inventories stored as un-normalized binary NBT blobs or MongoDB BSON arrays</strong>.
</p>

<p>
When a player drops an item and simultaneously triggers a proxy disconnect, one thread writes the inventory while another thread handles the drop entity. Because external databases cannot execute an atomic lock spanning the player state, the ground entity, and the proxy session, both actions succeed.
</p>

<p>
In our SpacetimeDB relational inventory schema:
</p>

<pre><code class="language-text">CONTAINER (container_id [PK], owner_spacetime_id)
    │
    └──► INVENTORY_SLOT (slot_id [PK], container_id, slot_index, item_instance_id [Unique])
              │
              └──► ITEM_INSTANCE (item_instance_id [PK], item_type_id, amount, durability)
                        │
                        ├──► ITEM_ENCHANT (enchant_id, level)
                        └──► ITEM_KILL_STAT (victim_spacetime_id, killed_at)
</code></pre>

<p>
Every item instance has an immutable 64-bit ID. An <code>item_instance_id</code> can exist in exactly <strong>one</strong> slot row at any given microsecond. Any reducer attempting to move an item must atomically verify the source slot, mutate the container reference, and commit. If a player attempts a concurrent disconnect or double-click exploit, the second reducer immediately fails validation. <strong>Item duplication is eliminated by architectural construction.</strong>
</p>

<hr style="border: none; border-top: 1px solid var(--uc-border); margin: 36px 0;" />

<h2>7. Production Reality & Benchmark Results</h2>

<p>
Running this architecture in production across our network yielded night-and-day operational improvements:
</p>

<ul>
  <li>
    <strong>End-to-End Latency:</strong> Traditional Redis-cache + Mongo writeback pipeline averaged <strong>18ms – 42ms</strong> p99 latency under combat load. With SpacetimeDB WASM reducers, p99 transaction commitment dropped to <strong>under 280 microseconds</strong>.
  </li>
  <li>
    <strong>Zero Cache-Aside Bug Reports:</strong> We eliminated over 4,000 lines of glue code responsible for caching, invalidation timers, distributed Redis locks, and MongoDB reconnect loops.
  </li>
  <li>
    <strong>Infrastructure Footprint:</strong> We shut down 6 Redis nodes, 3 MongoDB replica sets, and 2 Kafka broker instances, replacing them with a single compiled SpacetimeDB container backed by our custom Rust edge proxies.
  </li>
</ul>

<p>
Traditional databases were designed for an era where application servers and storage lived on separate machines connected by slow networks, exchanging ad-hoc SQL strings. In modern high-frequency systems where microseconds matter, <strong>executing compiled reducers directly inside memory-resident relational state is the only architecture that makes sense</strong>.
</p>
    `,
  },
]

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}
