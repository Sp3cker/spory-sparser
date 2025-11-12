Processor Refactor

Added src/newSpriteGenerator/PeopleSpriteProcessorBase.ts (line 1) to centralize frame extraction/cropping/padding and support 2× WEBP scaling via createAnimatedWebP2x.
Reworked src/newSpriteGenerator/CharacterSpriteProcessor.ts (line 1) to extend the base class, keeping native-pixel logic, padding, limited-run support, and logging while delegating shared work.
Trainer Support

Introduced src/newSpriteGenerator/TrainerSpriteProcessor.ts (line 1) to adapt the same normalization pipeline for trainer sheets (PNG + optional lossless WEBP), replacing the disparate resizePeopleSprite logic.
JSON Pipeline

Built src/newSpriteGenerator/SpriteDatasetPipeline.ts (line 1) so JSON rules map palette + .bpp4.smol inputs to palette-applied PNGs and then drive either processor (includes ready-made overworld and trainer rules).
Exported the trainer schema for reuse (src/parseMaps/Trainers/joinTrainerGraphics.ts (line 19)) so both pipelines validate consistently.
Updated the CLI (src/newSpriteGenerator/runCharacterSpriteProcessor.ts (line 1)) to run the overworld pipeline by default; passing --source still processes a custom directory directly.
Build

npm run build
Next steps (pick whatever’s useful):

Add a CLI entry that invokes SpriteDatasetPipeline with the trainer rule for parity.
Decide where the pipeline should write trainer outputs (trainers/raw & trainers/processed) and wire any downstream consumers.