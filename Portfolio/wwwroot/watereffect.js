let canvas, ctx;

function initializeWaterEffect() {
    canvas = document.getElementById('water-effect-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.addEventListener('mousemove', (e) => {
        drawWaterEffect(e.clientX, e.clientY);
    });

    function drawWaterEffect(x, y) {
        // Water effect parameters
        let radius = 20;
        let gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

window.initializeWaterEffect = initializeWaterEffect;
