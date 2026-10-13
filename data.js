/* =====================================================================
   ===================================================================== */

const GH = "https://github.com/Rah00m";

const SITE = {
  name: "Rahma Fathy",
  title: "Biomedical Engineering Student and AI & Medical Imaging Researcher",
  lede: "I build AI for medical data, from reading medical images to physics-guided models and practical clinical tools.",
  photo: "photo.jpg",
  school: "Systems & Biomedical Engineering, Cairo University",
  location: "Cairo, Egypt",
  email: "rahmafathy630@gmail.com",
  linkedin: "https://linkedin.com/in/rahmafathy105",
  github: GH,
  about: [
    "I'm a biomedical engineer and AI researcher focused on medical image analysis, physics-guided deep learning, and cognitive AI. I've built healthcare projects that won awards, contributed to open-source software, and designed adaptive reading assistants for people with learning disabilities.",
    "I'm looking to pursue a Master's degree in AI to deepen my research background and build practical clinical AI tools."
  ],
  facts: [
    ["Education", "B.Sc. in Systems and Biomedical Engineering, Cairo University (Oct 2022 to Jul 2027, expected)"],
    ["GPA", "3.7 / 4.00"],
    ["Languages", "Arabic, English (IELTS in preparation)"],
    ["Currently", "Building Read with Me, my graduation project, and teaching ML/AI at NetPoint"]
  ]
};

const FEATURED = [
  {
    title: "Read with Me: Adaptive Reading Assistant",
    status: "In progress, graduation project",
    summary: "A closed-loop, gaze-driven AI engine for people with learning disorders. It turns real-time eye-movement parameters into adaptive reading interventions.",
    points: [
      "Designed a 5-layer pipeline: hardware gaze capture, oculomotor event extraction (fixations, saccades, regressions), diagnostic ML classification, an adaptive AI controller, and an interactive reading interface.",
      "Engineered a transfer-learning and domain-adaptation chain with super-resolution velocity reconstruction, so closed-loop adaptation can work on standard webcams.",
      "Paper in preparation on gaze-contingent adaptive interventions and oculomotor profiling for specific learning disorders (proposal stage)."
    ],
    tags: ["Eye tracking", "Transfer learning", "Domain adaptation", "Python"],
    links: [{ label: "GitHub", url: "https://github.com/Read-W-Me" }]
  },
  {
    title: "AI-Powered Retinal Oxygen Transport Modeling (PINN)",
    summary: "A physics-informed neural network for steady-state oxygen transport in the retina.",
    points: [
      "Designed a forward PINN in TensorFlow with four sub-networks, one per tissue layer.",
      "Trained them jointly with a custom loop that enforces PDE residuals and pressure/flux-continuity conditions at the layer interfaces.",
      "Verified against an independent closed-form solution, with 1.2 to 15% relative L2 error across layers."
    ],
    tags: ["PINN", "TensorFlow", "PDEs", "Physiological modeling"],
    links: [{ label: "GitHub", url: "https://github.com/Ziad-Ashraf-Abdu/Retinal_O2_transport" }]
  },
  {
    title: "AI-Based Pulmonary Gas Exchange & Disease Diagnosis",
    award: "2nd place, Cairo University Research Day",
    summary: "Chest X-ray diagnosis combined with a lung gas diffusion model, supervised by Dr. Ahmed Abdelsamea.",
    points: [
      "Fine-tuned DenseNet121 (TensorFlow) on NIH ChestX-ray14 for multi-label classification of 14 thoracic diseases, with a probability threshold to flag normal cases.",
      "Built a desktop app that shows the top-three predicted probabilities and tracks each patient's disease progression across follow-up X-rays.",
      "Used an existing FEM-based lung gas diffusion model to support the analysis of predictions."
    ],
    tags: ["DenseNet121", "ChestX-ray14", "TensorFlow", "Desktop app"],
    links: [{ label: "GitHub", url: "https://github.com/Rah00m/classification-and-follow-up-for-lung-diseases" }]
  },
  {
    title: "Multimodal Skin Lesion Classification",
    summary: "An interpretable benign vs malignant classifier that fuses handcrafted dermoscopic features with patient metadata.",
    points: [
      "Segmented lesions with GrabCut and extracted color, texture, and ABCD shape features.",
      "A hybrid ANOVA / mutual information / XGBoost selection cut 61 features down to 25.",
      "Handled class imbalance with undersampling and training-only augmentation. XGBoost reached 0.858 AUC and 0.749 weighted F1 on a stratified held-out split."
    ],
    tags: ["XGBoost", "HAM10000", "OpenCV", "Interpretable ML"],
    links: [{ label: "GitHub", url: "https://github.com/Rah00m/Multimodal-skinLesion-classification" }]
  },
  {
    title: "Dental Panoramic X-ray Detection (YOLOv8)",
    summary: "A detector built on a public dataset after fixing the data leakage inside it.",
    points: [
      "Audited a public panoramic (OPG) dataset and found cross-split duplicates and near-duplicates using perceptual hashing.",
      "Rebuilt 70/15/15 splits (9,332 / 1,985 / 1,986 images) by similarity group. MD5 verification found zero cross-split leakage.",
      "Converted polygons to boxes, removed 4,210 outlier boxes, reduced 31 classes to four, added 382 background X-rays, and trained a YOLOv8 detector."
    ],
    tags: ["YOLOv8", "Dataset auditing", "Perceptual hashing"],
    links: [] 
  },
  {
    title: "OpenVINO: CPU Layer Fusion Control",
    status: "Open-source contribution",
    summary: "An upstream pull request to OpenVINO that makes per-layer profiling possible on CPU.",
    points: [
      "Analyzed OpenVINO's CPU execution graph to find how layer fusion hid per-layer metrics for operations such as ReLU and HardSwish.",
      "Implemented a DISABLE_LAYER_FUSION runtime property and environment variable in the CPU plugin for unfused profiling.",
      "Added validation tests and documentation, and submitted everything as an upstream pull request."
    ],
    tags: ["OpenVINO", "C++", "Open source", "Profiling"],
    links: [
      { label: "GitHub", url: "https://github.com/Rah00m/openvino_disable_fusion" },
      { label: "Issue", url: "https://github.com/openvinotoolkit/openvino/issues/31108" },
      { label: "Pull request", url: "https://github.com/openvinotoolkit/openvino/pull/31215" }
    ]
  }
];

const OTHER = [
  { title: "SmartSignalAI: DSP & AI Diagnostics Platform", text: "Multi-signal ECG/acoustic/RF viewer, unsupervised ECG anomaly detector, pretrained 12-lead CNN, STFT Doppler estimation, SAR target detection.", links: [{ label: "GitHub", url: "https://github.com/Rah00m/SmartSignalAI" }] },
  { title: "Signal Equalizer: DSP Audio Processing & AI Source Separation", text: "Custom Cooley-Tukey FFT/IFFT from scratch for band filtering, with Demucs v3 and Asteroid source separation compared against FFT filtering.", links: [{ label: "GitHub", url: "https://github.com/ZEY0D/Signal-Equalizer" }] },
  { title: "RequestSense_AI: Bilingual Complaint Classification", text: "Proof-of-concept Arabic/English classifier (fine-tuned XLM-RoBERTa) trained on a 443-sample synthetic dataset that mixes separate Arabic and English datasets.", links: [{ label: "GitHub", url: "https://github.com/Rah00m/RequestSense_AI" }] },
  { title: "Collaborative Dual-Elevator System over SPI IPC", text: "Two-elevator controller on two STM32 MCUs with a framed SPI protocol, task allocation, and fault fallback to independent mode.", links: [{ label: "GitHub", url: "https://github.com/Rah00m/collaborative-dual-elevator-system-over-spi-ipc" }] },
  { title: "Auto-Cooler: Closed-Loop Temperature Control", text: "STM32F4 fan controller with DMA-driven ADC, PWM, a Mealy state machine, and a custom 4-bit LCD1602 driver.", links: [] },
  { title: "Virtual Search-and-Rescue Operations: 3D Simulation in Blender", text: "Emergency-response environment with character and vehicle animation, textured scenes, lighting, and audio.", links: [{ label: "Video", url: "https://drive.google.com/file/d/1IEFNmwu3gp3t3PEuhn2TzGpG8PLpG080/view?usp=sharing" }] }
];

/* الأحدث فوق */
const TRAINING = [
  { when: "Oct 2026 to now", title: "Master AI Agents & LLMs", org: "Digital Hub (D-Hub) & Orange Digital Center" },
  { when: "Aug to Sep 2026", title: "AI in Healthcare: ML, Deep Learning, Bioinformatics & Medical AI", org: "OmniGenics", links: [{ label: "Certificate", url: "https://drive.google.com/file/d/1Dx7fQ8WMvZfiit13dCBFv4cOJL3EhiuB/view?usp=sharing" }] },
  { when: "Sep to Oct 2025", title: "AI for All: From Basics to GenAI Practice", org: "NVIDIA Academy", links: [{ label: "Certificate", url: "https://drive.google.com/file/d/1XArBUf0NcmIPF91cDgHhxBIt4CauM2Xx/view?usp=sharing" }] },
  { when: "Aug to Sep 2025", title: "Biomedical Engineering Applications of Laser (90 h)", org: "NILES", links: [{ label: "Certificate", url: "https://drive.google.com/file/d/1s3mtnBqugOeJN9tbXfWT2pOWi19fK5GQ/view?usp=sharing" }] },
  { when: "Jul to Aug 2025", title: "Clinical Engineering (90 h)", org: "Egyptian Railways Medical Center", links: [{ label: "Certificate", url: "https://drive.google.com/file/d/1gwyecSpatmthvJ2hpavPGyiywTk22kMH/view?usp=sharing" }] },
  { when: "Jul to Dec 2025", title: "AI and Omics Research Internship: AI, Biotechnology & Bioinformatics", org: "AI and Omics Research", links: [{ label: "Certificate", url: "https://drive.google.com/file/d/1fKrhH2XQ6YZ2OAHbZGwLDf9xrNnlVtRW/view?usp=sharing" }] }
];

const LEADERSHIP = [
  { when: "Jul 2026 to now", title: "ML/AI Instructor", org: "NetPoint" },
  { when: "Nov 2024 to Jul 2025", title: "Active Member", org: "IEEE EMBS Chapter" },
  { when: "Aug 2023 to Jul 2024", title: "PR & Event Organizer", org: "Technical Center for Career Development (TCCD)" },
  { when: "Oct 2022 to Aug 2023", title: "Marketing Member, Best Member Award", org: "Positive Ions" }
];

const AWARDS = [
  "2nd place, Cairo University Research Day, for the pulmonary gas exchange disease diagnosis project",
  "3rd place among 30+ teams, Smart Garage Competition (Beta Academy)",
  "Participant, NASA Space Apps Challenge: built an interactive, educational orrery web app for visualizing Near-Earth Objects",
  "Coach Academy: Level 3 in Competitive Programming Problem Solving"
];

const SKILLS = [
  ["Programming", "Python, C/C++, Java, JavaScript"],
  ["Machine learning", "TensorFlow, Keras, PyTorch, Hugging Face Transformers, scikit-learn, XGBoost, OpenCV, NumPy, Pandas"],
  ["Signals & systems", "FFT/STFT, ECG processing, STM32 embedded development, Blender"],
  ["Tools & frameworks", "Git, GitHub, React.js, Node.js, Spring Boot"]
];

/* =====================================================================
   ===================================================================== */
const POSTS = [

];