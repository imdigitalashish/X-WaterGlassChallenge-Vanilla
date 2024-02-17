
const URL = "https://teachablemachine.withgoogle.com/models/m8ALa4GIk/";


class Application {
    constructor() {

        this.glasses = {
            "wg1": 0,
            "wg2": 0,
            "wg3": 0,
        }

        this.model;
        this.webcam;
        this.labelContainer;
        this.maxPredictions;

        this.init();


        this.registerEvents();
        this.renderGlasses();
    }

    utils = {
        getTopPrediction: (predictions, sortBy = "probability", descending = true) => {
            if (!predictions || !predictions.length) return null;

            // Sort predictions based on the specified criteria
            predictions.sort((a, b) => {
                const comparisonValue = typeof sortBy === "function" ? sortBy(a, b) : a[sortBy] - b[sortBy];
                return descending ? -comparisonValue : comparisonValue;
            });

            // Return the top prediction
            return predictions[0];
        },


        currentSlide: {
            prevglassno: "",
            incrementWater: (glassno) => {
                if (glassno != this.utils.currentSlide.prevglassno) {
                    if (this.glasses[glassno] + 200 <= 1000) {
                        this.glasses[glassno] += 200;


                    }
                    this.renderGlasses();

                    setTimeout(() => {
                        console.log("Hello")
                        this.distributeWater(glassno, 200);
                        this.renderGlasses();

                    }, 600)

                    this.utils.currentSlide.prevglassno = glassno
                }
            }
        },

        predict: async () => {
            const prediction = await this.model.predict(this.webcam.canvas);


            let topPrediction = this.utils.getTopPrediction(prediction);
            console.log(topPrediction)
            switch (topPrediction.className) {
                case "Class 1":
                    this.utils.currentSlide.incrementWater("wg1")
                    break;
                case "Class 2":
                    this.utils.currentSlide.incrementWater("wg2")
                    break;
                case "Class 3":
                    this.utils.currentSlide.incrementWater("wg3")
                    break;

                default:
                    console.warn("Unknown prediction class:", topPrediction.className);
            }

        }
    }

    init = async () => {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";


        this.model = await tmImage.load(modelURL, metadataURL);
        this.maxPredictions = this.model.getTotalClasses();

        const flip = true; // whether to flip the webcam
        this.webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await this.webcam.setup(); // request access to the webcam
        await this.webcam.play();
        requestAnimationFrame(this.loop.bind(this))
        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(this.webcam.canvas);
        this.labelContainer = document.getElementById("label-container");
        for (let i = 0; i < this.maxPredictions; i++) { // and class labels
            this.labelContainer.appendChild(document.createElement("div"));
        }
    }


    loop = async () => {

        this.webcam.update(); // update the webcam frame
        await this.utils.predict();
        requestAnimationFrame(this.loop.bind(this))
    }


    renderGlasses = () => {
        document.querySelectorAll(".waterGlasses").forEach(waterGlass => {
            waterGlass.style.height = (150 / 1000) * this.glasses[waterGlass.dataset.id] + 'px';
        })
    }

    registerEvents = () => {
        document.querySelectorAll('.addButton').forEach(btn => btn.addEventListener("click", (e) => {
            let glassno = e.target.dataset.glassno;
            if (this.glasses[glassno] + 200 <= 1000) {
                this.glasses[glassno] += 200;


            }
            this.renderGlasses();

            setTimeout(() => {
                console.log("Hello")
                this.distributeWater(glassno, 200);
                this.renderGlasses();

            }, 600)

        }))

        document.querySelectorAll('.takeButton').forEach(btn => btn.addEventListener("click", (e) => {

            let glassno = e.target.dataset.glassno;
            if (this.glasses[glassno] - 200 >= 0) {
                this.glasses[glassno] -= 200;

                setTimeout(() => {
                    console.log("Hello")
                    this.distributeWater(glassno, 200);
                    this.renderGlasses();

                }, 600)
            }
            this.renderGlasses();



        }))
    }


    distributeWater = () => {
        const sumWaterLevels = (glasses) => Object.values(glasses).reduce((sum, level) => sum + level, 0);

        const numGlasses = Object.keys(this.glasses).length;
        const amountPerGlass = sumWaterLevels(this.glasses) / numGlasses;

        console.log(amountPerGlass)
        // this.glasses[sourceGlassNo] = 0;
        for (const glassNo in this.glasses) {
            this.glasses[glassNo] = amountPerGlass;
        }

    }
}


window.onload = () => {
    window.app = new Application();
}



