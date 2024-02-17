class Application {
    constructor() {

        this.glasses = {
            "wg1": 0,
            "wg2": 0,
            "wg3": 0,
        }

        this.registerEvents();
        this.renderGlasses();
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