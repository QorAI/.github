# QOR — The Qore Mind

## What This Is
**QOR** (pronounced "core") is a mind-like AI architecture. Instead of traditional AI that freezes after training, QOR keeps learning — like a real mind. It has multi-speed memory, surprise-driven learning, and neurons that adapt in real-time.

Built on Google's Nested Learning research (NeurIPS 2025), packaged as a single Python file you can train on your laptop.

## What's Inside `qor_minimal.py`

```
┌─────────────────────────────────────────────────────────────┐
│                  QOR — The Qore Mind (~5M params)           │
│                                                             │
│  Input bytes ──► Embedding + Position                       │
│       │                                                     │
│       ▼                                                     │
│  ┌─── QOR Block (×6 layers) ───────────────────────────┐   │
│  │                                                      │   │
│  │  1. Focus (Causal Self-Attention)                    │   │
│  │     └─ decides what to pay attention to              │   │
│  │                                                      │   │
│  │  2. Live Adaptation (Self-Modifying Neurons)         │   │
│  │     └─ weights change during thinking                │   │
│  │     └─ surprise triggers adaptation                  │   │
│  │     └─ like "wait, that's new!" moments              │   │
│  │                                                      │   │
│  │  3. Multi-Speed Memory (Continuum Memory)            │   │
│  │     ├─ ⚡ Fast   — working thoughts (every step)     │   │
│  │     ├─ ◆ Medium — recent recall (every 16 steps)    │   │
│  │     └─ 🔮 Deep   — core knowledge (every 64 steps)  │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│       │                                                     │
│       ▼                                                     │
│  LayerNorm ──► Output ──► Next prediction                   │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start (3 commands)

```bash
# 1. Install (only needs PyTorch)
pip install torch

# 2. Train on synthetic data (~5 min on CPU, ~1 min on GPU)
python qor_minimal.py

# 3. Chat with your model
python qor_minimal.py --chat
```

## All Commands

```bash
# Train on synthetic data (default, fast)
python qor_minimal.py

# Train on Wikipedia (needs 'pip install datasets')
python qor_minimal.py --wiki

# Run continual learning test (QOR vs Baseline)
python qor_minimal.py --test-cl

# Chat with trained model
python qor_minimal.py --chat

# Adjust model size
python qor_minimal.py --d-model 128 --n-layers 4 --steps 2000     # Tiny (~1.5M)
python qor_minimal.py --d-model 256 --n-layers 6 --steps 5000     # Nano (~5M) ← default
python qor_minimal.py --d-model 384 --n-layers 8 --steps 10000    # Small (~15M)
python qor_minimal.py --d-model 512 --n-layers 12 --steps 20000   # Medium (~50M)

# Force specific device
python qor_minimal.py --device cpu
python qor_minimal.py --device cuda
python qor_minimal.py --device mps    # Mac Apple Silicon
```

## The Mind Test — Does QOR Actually Remember?

This is the key experiment. It tests whether QOR's multi-speed memory prevents forgetting:

```bash
python qor_minimal.py --test-cl
```

What it does:
1. Trains QOR on **animal facts** ("Cats have four legs...")
2. Then trains QOR on **math facts** ("Two plus two equals four...")
3. Tests: does it still remember animals after learning math?
4. Runs the same test with a standard transformer (no CMS, no self-mod)
5. Compares results

Expected outcome:
- **QOR**: Remembers both animals AND math (like a real mind)
- **Baseline**: Forgets animals after learning math (catastrophic forgetting)

## Hardware Requirements

| Config | Params | RAM | Train Time (CPU) | Train Time (GPU) |
|--------|--------|-----|-------------------|-------------------|
| Tiny   | ~1.5M  | 1GB | ~2 min            | ~30 sec           |
| Nano   | ~5M    | 2GB | ~5 min            | ~1 min            |
| Small  | ~15M   | 4GB | ~15 min           | ~3 min            |
| Medium | ~50M   | 8GB | ~1 hour           | ~10 min           |

## How to Read the Training Output

```
  Step |     Loss | Surprise |           CMS Status |      Speed |         LR
  ---------+----------+-----------+----------------------+------------+-----------
   100 |   4.2341 |    4.1200 | F:True M:False S:False |   12000t/s |  0.000150
   200 |   3.8567 |    3.7800 | F:True M:False S:False |   12500t/s |  0.000300
   250 |   3.5123 |    3.4500 | F:True M:True  S:False |   11800t/s |  0.000300
```

- **Loss**: Lower is better (model is learning)
- **Surprise**: How unexpected tokens are on average
- **CMS Status**: Which memory layers are active this step
  - F=Fast thoughts, M=Medium recall, S=Deep knowledge
  - True = learning this step
  - False = protecting existing knowledge this step
- **Speed**: Tokens processed per second
- **LR**: Current learning rate

## What to Experiment With

Edit the `QORConfig` in the file to try:

| Setting | What It Does | Try |
|---------|-------------|-----|
| `cms_med_freq` | How often medium memory consolidates | 8, 16, 32, 64 |
| `cms_slow_freq` | How often deep knowledge updates | 32, 64, 128, 256 |
| `self_mod_lr` | How fast live adaptation happens | 0.01, 0.02, 0.05 |
| `self_mod_decay` | How much previous adaptation is retained | 0.9, 0.95, 0.99 |
| `surprise_threshold` | What counts as "surprising enough to learn" | 0.1, 0.5, 1.0 |

## Next Steps — Growing the Qore Mind

1. **Scale up**: Use the kmccleary3301/nested_learning repo for 760M-1.3B param QOR models
2. **Real tokenizer**: Replace byte-level with SentencePiece (32K vocab) for better language understanding
3. **Better data**: Use RefinedWeb or The Pile for deeper pre-training
4. **Multi-GPU**: Switch to FSDP or DDP training for larger minds
5. **Evaluation**: Add proper benchmarks (PIQA, HellaSwag, etc.)
6. **Domain minds**: Train specialized QOR models for medical, legal, or code domains
