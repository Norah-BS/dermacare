const photoInput = document.getElementById("photo-input");
const previewImg = document.getElementById("preview-img");
const analyzeBtn = document.getElementById("analyze-btn");
const canvas = document.getElementById("analysis-canvas");
const ctx = canvas.getContext("2d");

const analysisSection = document.getElementById("analysis-section");
const rednessBadge = document.getElementById("redness-score-badge");
const acneBadge = document.getElementById("acne-score-badge");
const pigmentationBadge = document.getElementById("pigmentation-score-badge");
const overallSeverityEl = document.getElementById("overall-severity");
const primaryConcernsEl = document.getElementById("primary-concerns");
const treatmentListEl = document.getElementById("treatment-list");
const routineListEl = document.getElementById("routine-list");

let loadedImage = null;

// Enable button when image is uploaded
photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
        analyzeBtn.disabled = true;
        previewImg.style.display = "none";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        loadedImage = new Image();
        loadedImage.onload = function () {
            previewImg.src = loadedImage.src;
            previewImg.style.display = "block";
            analyzeBtn.disabled = false;
        };
        loadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

analyzeBtn.addEventListener("click", function () {
    if (!loadedImage) return;

    const maxWidth = 300;
    const scale = maxWidth / loadedImage.width;
    const width = maxWidth;
    const height = loadedImage.height * scale;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(loadedImage, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let rednessCount = 0;
    let acneCount = 0;
    let darkCount = 0;
    let totalSkinPixels = 0;

    const step = 4 * 20;

    for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = (r + g + b) / 3;

        const isSkin =
            r > 50 && g > 40 && b > 30 &&
            r < 255 && g < 240 && b < 230 &&
            r > b - 10 &&
            g > b - 20;

        if (!isSkin) continue;

        totalSkinPixels++;

      
        if (r > 180 && g < 100 && b < 120) continue;

        const isBrown =
            r > 120 &&
            g > 80 &&
            b < 80 &&
            (r - g) < 40 &&     
            brightness < 150;

        if (!isBrown) {
            const strongRed =
                r > 170 &&
                r > g * 1.3 &&
                r > b * 1.4 &&
                brightness > 95;

            const warmPink =
                r > 155 &&
                r > g + 25 &&
                r > b + 25 &&
                brightness > 110;

            if (strongRed || warmPink) {
                rednessCount++;
            }
        }


        const inflamedAcne =
            r > 150 &&
            g < 130 &&
            b < 130 &&
            r > g + 20 &&
            r > b + 20;

        const darkAcne =
            r > 120 &&
            g < 90 &&
            b < 90 &&
            brightness < 150;

        const brownAcne =
            r > 110 &&
            g > 70 &&
            b < 70 &&
            brightness < 140;

        if (inflamedAcne || darkAcne || brownAcne) {
            acneCount++;
        }


        const deepPigment = brightness < 85;

        const mediumPigment =
            brightness < 130 &&
            r > 70 && g > 50 && b < 70 &&
            r > b + 10;

        const lightPigment =
            brightness < 160 &&
            r > 80 && g > 70 && b < 70 &&
            (r - b) > 10;

        if (deepPigment || mediumPigment || lightPigment) {
            darkCount++;
        }
    }

    const rednessScore = normalizeScore(rednessCount, totalSkinPixels, 140);
    const acneScore = normalizeScore(acneCount, totalSkinPixels, 180);
    const pigmentationScore = normalizeScore(darkCount, totalSkinPixels, 180);

    rednessBadge.textContent = `Redness: ${rednessScore}`;
    acneBadge.textContent = `Acne: ${acneScore}`;
    pigmentationBadge.textContent = `Pigmentation: ${pigmentationScore}`;

    const { severityLabel, concerns } = getSeverityAndConcerns(
        rednessScore,
        acneScore,
        pigmentationScore
    );
    overallSeverityEl.textContent = severityLabel;

    renderConcerns(concerns);
    renderRecommendations(rednessScore, acneScore, pigmentationScore);

    analysisSection.style.display = "block";
});

function normalizeScore(count, total, scaleFactor) {
    if (total === 0) return 0;

    if (count < 10) return 0;

    let score = Math.round((count / total) * scaleFactor);
    return Math.min(100, Math.max(0, score));
}

function getSeverityAndConcerns(redness, acne, pigmentation) {
    const concerns = [];

    if (redness > 30) concerns.push("Redness / sensitivity");
    if (acne > 30) concerns.push("Acne / breakouts");
    if (pigmentation > 30) concerns.push("Pigmentation / dark spots");

    let maxScore = Math.max(redness, acne, pigmentation);
    let severityLabel = "Very Mild";

    if (maxScore > 70) severityLabel = "Severe";
    else if (maxScore > 50) severityLabel = "Moderate";
    else if (maxScore > 30) severityLabel = "Mild";

    return { severityLabel, concerns };
}

function renderConcerns(concerns) {
    primaryConcernsEl.innerHTML = "";
    if (concerns.length === 0) {
        primaryConcernsEl.innerHTML =
            '<span class="diagnosis-tag">Overall balanced skin</span>';
        return;
    }
    concerns.forEach((c) => {
        const span = document.createElement("span");
        span.className = "diagnosis-tag";
        span.textContent = c;
        primaryConcernsEl.appendChild(span);
    });
}

function renderRecommendations(redness, acne, pigmentation) {
    treatmentListEl.innerHTML = "";
    routineListEl.innerHTML = "";

    const treatments = [];
    const routine = [];

    if (redness > 40) {
        treatments.push(
            "Calming facial with anti‑inflammatory ingredients (e.g., aloe vera, centella asiatica).",
            "LED light therapy (red light) to reduce inflammation and sensitivity."
        );
        routine.push(
            "Use a gentle, fragrance‑free cleanser twice daily.",
            "Apply a soothing serum with niacinamide or panthenol.",
            "Always finish with a broad‑spectrum SPF 50 sunscreen."
        );
    }

    if (acne > 40) {
        treatments.push(
            "Deep cleansing / acne facial with extractions.",
            "Chemical peel (salicylic acid) sessions for active acne.",
            "Blue‑light LED therapy to target acne‑causing bacteria."
        );
        routine.push(
            "Use a mild foaming cleanser with salicylic acid (once daily).",
            "Spot‑treat active breakouts with benzoyl peroxide or salicylic acid.",
            "Avoid heavy, comedogenic makeup."
        );
    }

    if (pigmentation > 40) {
        treatments.push(
            "Brightening chemical peels (glycolic or lactic acid).",
            "Laser or IPL sessions for stubborn dark spots."
        );
        routine.push(
            "Use a vitamin C serum in the morning.",
            "Apply a gentle exfoliant 1–2 times per week.",
            "Never skip sunscreen; UV exposure worsens pigmentation."
        );
    }

    if (redness <= 40 && acne <= 40 && pigmentation <= 40) {
        treatments.push(
            "Hydrating facial to maintain skin barrier.",
            "Occasional gentle peel for radiance."
        );
        routine.push(
            "Cleanser → Moisturizer → Sunscreen.",
            "Add hyaluronic acid serum if skin feels dry."
        );
    }

    treatments.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        treatmentListEl.appendChild(li);
    });

    [...new Set(routine)].forEach((r) => {
        const li = document.createElement("li");
        li.textContent = r;
        routineListEl.appendChild(li);
    });
}
