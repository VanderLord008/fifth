Phase 2: The Cloud Journey (Atmos-Inspired Flight)
Visual Goals
Match the aesthetic of atmos.leeroy.ca

Implementation Steps
Gradient Sky Shader

Warm orange/pink at horizon
Cool blue/purple at zenith
Smooth color interpolation
Volumetric Cloud System

Clusters of soft, blobby spheres (not flat planes)
Multiple cloud layers at different depths
Instanced meshes for performance
Opacity/color variation within clusters
Camera Flight Animation

Start slow, accelerate through clouds
Dynamic FOV changes (wider during fast movement)
Subtle camera shake and sway
Banking/roll effects for organic feel
Total duration: 8-12 seconds
Fog System

Depth-based density
Increases/decreases based on camera position
Soft edges on clouds
Magical Elements

Golden Snitch fly-by (optional)
Sparkle particle trails
Clouds part to reveal castle
Files to Create
src/components/canvas/CloudJourney/
├── CloudJourneyScene.jsx    # Main scene orchestrator
├── GradientSky.jsx          # Sky shader component
├── VolumetricClouds.jsx     # Cloud system
├── CameraPath.jsx           # GSAP camera animation
└── GoldenSnitch.jsx         # Optional fly-by element
Phase 3: Arrival at Castle Gate
Visual Elements
Floating Gothic Castle

Harry Potter-style architecture
Multiple towers and turrets
Floating in sky/clouds
Can be GLTF model or procedural geometry
Main Gate Structure

Stone archway entrance
Magical glowing rune details
Enchanted ivy/vines on stonework
Ground fog/mist effect
Floating Candles

Animated flames
Gentle bobbing motion
Warm point lights
Marmalade the Cat Mascot 🐱

Chubby orange cat with wizard hat
Idle Animations:
Breathing (scale pulse)
Tail swishing
Ear twitches
Occasional blinks
Interactive:
Head tilt on mouse hover
Purring particle effect
Sits next to floating parchment banner
Parchment Banner

Your name (magical font)
Title: "Web Developer & 3D Enthusiast"
Tagline
"Enter" call-to-action
Interactions
Click cat or banner → Gate opens with animation
Camera enters through gate
Files to Create
src/components/canvas/CastleGate/
├── CastleGateScene.jsx      # Main scene
├── Castle.jsx               # Castle model/geometry
├── GateArchway.jsx          # Gate structure
├── FloatingCandles.jsx      # Candle system
├── MarmaladeCat.jsx         # Cat mascot with animations
├── ParchmentBanner.jsx      # Info banner
└── GroundFog.jsx            # Mist effect
Phase 4: The Great Hall (Portfolio Hub)
Environment
Hall Layout

Circular or octagonal shape
High vaulted ceiling
Stone walls with magical tapestries
Central floor design (magical compass/symbol)
Lighting

Floating candles (like Hogwarts Great Hall)
Dramatic torch lighting on walls
Ambient magical glow
Portal Door System
Create 5-6 themed portal doorways:

Portal	Theme	Visual Style	Projects
🔥 Flame	Fire particles, orange/red glow	Web Applications	
💎 Crystal	Crystalline, blue/cyan sparkles	Three.js Projects	
🌿 Nature	Vines, green, organic feel	UI/UX Projects	
🌑 Shadow	Dark, mysterious, purple	Experimental Work	
✨ Golden	Brightest, most ornate	Featured/Best Work	
Portal Features
Swirling energy shader inside
Project name floating above
Hover: Intensifies, "beckons" user
Click: Portal expands, camera flies in
About Me Section
"Talking portrait" or magical statue
Skills as floating magical elements
Social links as floating icons
Contact section
Navigation
Camera in center, can look around
Orbit controls or drag navigation
Smooth camera transitions to portals
Files to Create
src/components/canvas/GreatHall/
├── GreatHallScene.jsx       # Main scene
├── HallEnvironment.jsx      # Walls, floor, ceiling
├── FloatingCandles.jsx      # Ceiling candles
├── Portal.jsx               # Reusable portal component
├── PortalShader.jsx         # Swirling energy effect
├── TalkingPortrait.jsx      # About me section
├── SkillOrbs.jsx            # Floating skill elements
└── SocialLinks.jsx          # Floating social icons
Phase 5: Project Worlds (Portal Transitions)
Transition Effect
Spell-casting visual (magic circle appears)
Camera flies into portal with whoosh
Scene transition during fly-through
Emerge in themed project world
Project World Template
Each world contains:

Themed 3D environment matching portal
Floating display screens with project details
Project info panel:
Title & description
Tech stack (as "spell ingredients" or potion bottles)
Live demo link
GitHub link
Return button ("Finite Incantatem")
Example Worlds
Crystal Cave (Three.js Projects)

Crystalline cave environment
3D model showcase rotating
Interactive demo embed
Tech details on floating crystals
Fire Realm (Web Apps)

Volcanic/flame themed
Project screenshots on floating panels
Ember particle effects
Nature Grove (UI/UX)

Forest/garden setting
Design mockups on floating leaves
Butterfly/firefly particles
Files to Create
src/components/canvas/ProjectWorlds/
├── ProjectWorldScene.jsx    # Base template
├── CrystalCave.jsx          # Three.js projects
├── FireRealm.jsx            # Web apps
├── NatureGrove.jsx          # UI/UX projects
├── ShadowRealm.jsx          # Experimental
├── GoldenSanctum.jsx        # Featured work
├── ProjectCard.jsx          # Reusable project info
├── PortalTransition.jsx     # Fly-through effect
└── ReturnPortal.jsx         # Back to hall
Shared Components & Utilities
Effects Library
src/components/effects/
├── SpellCircle.jsx          ✅ Created
├── MagicWand.jsx            ✅ Created
├── MagicalParticles.jsx     ✅ Created
├── StarField.jsx            ✅ Created
├── FloatingCandles.jsx      # Reusable
├── GroundFog.jsx            # Reusable
└── SparkleTrail.jsx         # Particle trails
Shaders
src/shaders/
├── gradientSky.glsl         # Sky gradient
├── portalSwirl.glsl         # Portal energy
├── fog.glsl                 # Volumetric fog
└── glow.glsl                # Object glow
State Management
src/stores/
└── portfolioStore.js        ✅ Created
    - currentScene
    - loadingProgress
    - selectedProject
    - activePortal
Tech Stack Summary
Package	Purpose
three	3D rendering engine
@react-three/fiber	React renderer for Three.js
@react-three/drei	R3F helpers (Text, Ring, etc.)
@react-three/postprocessing	Bloom, glow effects
gsap	Smooth animations
zustand	State management
leva	Debug controls (dev only)
