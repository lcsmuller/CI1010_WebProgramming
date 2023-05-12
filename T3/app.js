$(document).ready(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let lines = [];
    let offsetX = 0, offsetY = 0;
    let selectedLineIndex = -1;

    let numSides = prompt("Digite um número entre 3 e 8 para gerar um polígono", "3");
    numSides = Math.max(3, Math.min(8, parseInt(numSides)));

    const createPolygon = (numSides, { x, y }, radius) => {
        for (let i = 0; i < numSides; i++) {
            const angle = (2 * Math.PI * i) / numSides;
            const x1 = x + radius * Math.cos(angle);
            const y1 = y + radius * Math.sin(angle);
            const x2 = x + radius * Math.cos(angle + (2 * Math.PI) / numSides);
            const y2 = y + radius * Math.sin(angle + (2 * Math.PI) / numSides);
            lines.push({ x1, y1, x2, y2 });
        }
    };

    const drawLines = () => 
        lines.forEach(({ x1, x2, y1, y2 }) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });

    const findLineIndex = (x, y) => {
        let nearestIndex = -1;
        let nearestDistance = Infinity;

        for (let i = 0; i < lines.length; i++) {
            const { x1, x2, y1, y2 } = lines[i];
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const distance = Math.sqrt((midX - x) ** 2 + (midY - y) ** 2);

            if (distance < nearestDistance) {
                nearestIndex = i;
                nearestDistance = distance;
            }
        }
        console.log(`Found line index: ${nearestIndex}`);
        return nearestIndex;
    };

    createPolygon(numSides, { x: 400, y: 300 }, 200);
    drawLines(lines);

    canvas.addEventListener('mousedown', e => {
        const { left, top } = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        selectedLineIndex = findLineIndex(x, y);
        if (selectedLineIndex !== -1) {
            offsetX = x - lines[selectedLineIndex].x1;
            offsetY = y - lines[selectedLineIndex].y1;
        }
    });

    canvas.addEventListener('mouseup', () => {
        selectedLineIndex = -1;
    });

    canvas.addEventListener('mousemove', e => {
        if (selectedLineIndex === -1) return;

        const { left, top } = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const maxDist = 20; // arbitrary amount

        lines.forEach(({ x1, x2, y1, y2 }, index) => {
            if (Math.abs(x - x1) < maxDist && Math.abs(y - y1) < maxDist) {
                lines[index].x1 = x;
                lines[index].y1 = y;
            } else if (Math.abs(x - x2) < maxDist && Math.abs(y - y2) < maxDist) {
                lines[index].x2 = x;
                lines[index].y2 = y;
            } else if (index === selectedLineIndex) {
                const dx = x - (x1 + x2) / 2;
                const dy = y - (y1 + y2) / 2;
                lines[index].x1 += dx;
                lines[index].y1 += dy;
                lines[index].x2 += dx;
                lines[index].y2 += dy;
            }
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(lines);
    });

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();

        const { left, top } = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        selectedLineIndex = findLineIndex(x, y);
        if (selectedLineIndex !== -1) {
            offsetX = x - lines[selectedLineIndex].x1;
            offsetY = y - lines[selectedLineIndex].y1;
        }

        const { x1, x2, y1, y2 } = lines[selectedLineIndex];

        lines.splice(selectedLineIndex, 1, { x1, y1, x2: x, y2: y });
        lines.splice(selectedLineIndex + 1, 0, { x1: x, y1: y, x2, y2 });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(lines);

        return false;
    });
});