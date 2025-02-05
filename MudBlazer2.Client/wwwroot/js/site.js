window.setBlazorHelper = (dotNetHelper) => {
    window.blazorHelper = dotNetHelper;
};
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "f" && hoveredPile) {
        window.flipCard(hoveredPile.id);
    }
});
document.addEventListener("keydown", async (e) => {
    if (e.key.toLowerCase() === "s" && hoveredPile) {
        console.log(`Shuffling pile: ${hoveredPile.id}`);
        shufflePile(hoveredPile.id);

        // 🔹 Call Blazor to shuffle the data internally
        if (window.blazorHelper) {
            await window.blazorHelper.invokeMethodAsync("ShufflePileJS", hoveredPile.id)
                .catch(() => console.warn("Blazor component is disposed."));
        }
    }
});


window.enableDragging = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.classList.remove("no-drag");
    el.style.cursor = "grab";

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    const hoverLift = 15; // Pixels the pile lifts when picked up
    const growScale = 1.1; // Scale factor for growth effect

    el.onmousedown = (e) => {
        if (el.classList.contains("no-drag")) return;

        isDragging = true;
        el.style.cursor = "grabbing";

        //   Bring the dragged element to the front
        el.style.zIndex = "1000";

        //   Apply hover effects: lift, grow, and shadow
        el.style.transition = "transform 0.15s ease-out, box-shadow 0.15s ease-out";
        el.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.4)"; // Soft shadow
        el.style.transform = `scale(${growScale})`; // Grow effect

        const boardRect = document.querySelector(".board").getBoundingClientRect();

        let posX = parseFloat(el.dataset.posX) || 0;
        let posY = parseFloat(el.dataset.posY) || 0;

        offsetX = e.clientX - boardRect.left - posX;
        offsetY = e.clientY - boardRect.top - posY;

        //   Lift and grow effect on pickup
        el.style.transform = `translate(${posX}px, ${posY - hoverLift}px) scale(${growScale}) rotate(${el.dataset.rotation || 0}deg)`;

        const onMouseMove = (e) => {
            if (!isDragging) return;

            let newX = e.clientX - boardRect.left - offsetX;
            let newY = e.clientY - boardRect.top - offsetY - hoverLift; // Maintain lift

            //   Smooth movement effect
            el.style.transition = "transform 0.05s linear";
            el.style.transform = `translate(${newX}px, ${newY}px) scale(${growScale}) rotate(${el.dataset.rotation || 0}deg)`;

            el.dataset.posX = newX;
            el.dataset.posY = newY;
        };

        const onMouseUp = () => {
            isDragging = false;
            el.style.cursor = "grab";

            //   Reset z-index, shadow, and growth effect after dropping
            el.style.zIndex = "";
            el.style.boxShadow = ""; // Remove shadow
            el.style.transition = "transform 0.15s ease-out, box-shadow 0.15s ease-out";
            el.style.transform = `translate(${el.dataset.posX}px, ${el.dataset.posY}px) scale(1) rotate(${el.dataset.rotation || 0}deg)`; // Return to normal size

            checkCollision(el);

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    el.onwheel = (e) => {
        e.preventDefault();
        let rotation = parseFloat(el.dataset.rotation) || 0;
        rotation += e.deltaY > 0 ? 10 : -10;
        el.dataset.rotation = rotation;
        el.style.transform = `translate(${el.dataset.posX || 0}px, ${el.dataset.posY || 0}px) scale(${isDragging ? growScale : 1}) rotate(${rotation}deg)`;
    };
};




//   Collision Detection
const checkCollision = (draggedElement) => {
    const allCards = document.querySelectorAll(".draggable");

    allCards.forEach(other => {
        if (other === draggedElement) return;

        if (checkOverlap(draggedElement, other)) {
            console.log(`Collision detected: ${draggedElement.id} → ${other.id}`);

            //   Call Blazor to merge stacks
            if (window.blazorHelper) {
                window.blazorHelper.invokeMethodAsync("OnCollisionDetected", draggedElement.id, other.id)
                    .catch(() => console.warn("Blazor component is disposed."));
            }

            snapToStack(draggedElement.id, other.id);
        }
    });
};

//   Shrinking Collision Box (15% padding)
const checkOverlap = (a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    const shrinkFactor = 0.15;
    const shrinkWidthA = rectA.width * shrinkFactor;
    const shrinkHeightA = rectA.height * shrinkFactor;
    const shrinkWidthB = rectB.width * shrinkFactor;
    const shrinkHeightB = rectB.height * shrinkFactor;

    const adjustedA = {
        left: rectA.left + shrinkWidthA,
        right: rectA.right - shrinkWidthA,
        top: rectA.top + shrinkHeightA,
        bottom: rectA.bottom - shrinkHeightA
    };

    const adjustedB = {
        left: rectB.left + shrinkWidthB,
        right: rectB.right - shrinkWidthB,
        top: rectB.top + shrinkHeightB,
        bottom: rectB.bottom - shrinkHeightB
    };

    return !(
        adjustedA.right < adjustedB.left ||
        adjustedA.left > adjustedB.right ||
        adjustedA.bottom < adjustedB.top ||
        adjustedA.top > adjustedB.bottom
    );
};

window.snapToStack = (droppedId, stackId) => {
    const droppedElement = document.getElementById(droppedId);
    const stackElement = document.getElementById(stackId);

    if (!droppedElement || !stackElement) return;

    const boardRect = document.querySelector(".board").getBoundingClientRect();
    const stackRect = stackElement.getBoundingClientRect();
    droppedElement.style.zIndex = "1000"; 
    //   Get the exact target position (absolute)
    let stackPosX = stackRect.left - boardRect.left;
    let stackPosY = stackRect.top - boardRect.top;
    const targetRotation = parseFloat(stackElement.dataset.rotation) || 0;

    console.log(`Snapping ${droppedId} to ${stackId}`);
    console.log(`Target X: ${stackPosX}, Y: ${stackPosY}, Rotation: ${targetRotation}`);

    //   Apply smooth transition
    droppedElement.style.transition = "left 0.3s ease-in-out, top 0.3s ease-in-out, transform 0.3s ease-in-out";
    droppedElement.style.position = "absolute"; // Ensure absolute positioning
    droppedElement.style.left = `${stackPosX}px`;
    droppedElement.style.top = `${stackPosY}px`;
    droppedElement.style.transform = `rotate(${targetRotation}deg)`;

    //   Ensure final position is stored
    setTimeout(() => {
        droppedElement.style.transition = "";
        droppedElement.dataset.posX = stackPosX;
        droppedElement.dataset.posY = stackPosY;
    }, 300);
};









//   Get Position of Pile
window.getPilePosition = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return { X: 0, Y: 0 };

    const rect = el.getBoundingClientRect();
    const boardRect = document.querySelector(".board").getBoundingClientRect();

    return {
        X: rect.left - boardRect.left,
        Y: rect.top - boardRect.top,
        Width: rect.width,
        Height: rect.height
    };
};

window.setElementPosValues = (elementId, posX) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.dataset.posX = posX;
};
window.setElementPosValues = (elementId, posX, posY) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.dataset.posX = posX;
    el.dataset.posY = posY;
};

//   Set Position Before Displaying (Prevents Flash)
window.setElementPosition = (originId, elementId, distance) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const oel = document.getElementById(originId);
    if (!oel) return;


    //   Explicitly store position
    console.log(`Drawn ${elementId} position  ${el.dataset.posX} - Origin ${originId} position  ${oel.dataset.posX}`);
    el.dataset.posX = oel.dataset.posX;
    console.log(`NEW: Drawn ${elementId} position  ${el.dataset.posX} - Origin ${originId} position  ${oel.dataset.posX}`);
};

//   Hide Element to Prevent Flash
window.setHidden = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.opacity = "0";
};

window.flipCard = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const cardInner = el.querySelector(".card-inner");
    const stackedCards = el.querySelectorAll(".card-shadow"); // Select stacked cards

    // Determine if currently flipped
    const isFlipped = el.classList.contains("flipped");

    // Toggle flip state
    el.classList.toggle("flipped");

    el.style.transition = "transform 0.15s ease-out, box-shadow 0.15s ease-out";
    el.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.4)"; // Soft shadow
    el.style.transform = `scale(1.1)`; // Grow effect
    // Apply flip animation to main card
    cardInner.style.transition = "transform 0.3s ease-in-out";
    cardInner.style.transform = isFlipped ? "rotateY(0deg)" : "rotateY(180deg)";

    // Apply synchronized flip animation to stacked cards
    stackedCards.forEach((card, index) => {
        card.style.transition = `transform 0.3s ease-in-out`; // Slight delay per card for stagger effect
        card.style.transform = isFlipped ? "rotateY(0deg)" : "rotateY(180deg)";
    });
    el.style.boxShadow = ""; // Remove shadow
    el.style.transition = "transform 0.15s ease-out, box-shadow 0.15s ease-out";
    el.style.transform = `translate(${el.dataset.posX}px, ${el.dataset.posY}px) scale(1) rotate(${el.dataset.rotation || 0}deg)`; // Return to normal size


};



window.moveElementRight = (originId, elementId, distance) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const oel = document.getElementById(originId);
    if (!oel) return;

    const boardRect = document.querySelector(".board").getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const originRect = oel.getBoundingClientRect();

    // Get the element's current position relative to the board
    let currentX = rect.left - boardRect.left;
    let currentY = rect.top - boardRect.top;

    let actualX = originRect.left;
    let actualY = originRect.top;

    console.log(`Current ${elementId} position  ${currentX} - ${currentY}`);
    console.log(`Actual ${originId} position  ${actualX} - ${actualY}`);

    // Target position to move right
    let targetX = currentX + distance;

    console.log(`Moving ${elementId} from ${currentX} to ${targetX} | distance - ${distance}px`);

    // Apply smooth transition
    el.style.transition = "transform 0.3s ease-in-out";
    console.log(`translate(${distance}px, 0px) rotate(${el.dataset.rotation || 0}deg)`);
    el.style.transform = `translate(${distance}px, 0px) rotate(${el.dataset.rotation || 0}deg)`;

    // Store the new position after the animation completes
    setTimeout(() => {
        el.style.transition = "";
        el.dataset.posX = parseFloat(distance);
        //el.dataset.posY; // Keep Y unchanged
        console.log(`New ${elementId} dataset  ${el.dataset.posX} - ${el.dataset.posY}`);
    }, 300);

};







//   Press 'D' to Draw Top Card from Hovered Pile
let hoveredPile = null;

document.addEventListener("mouseover", (e) => {
    const pile = e.target.closest(".draggable");
    if (pile) {
        hoveredPile = pile;
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.closest(".draggable") === hoveredPile) {
        hoveredPile = null;
    }
});

document.addEventListener("keydown", async (e) => {
    if (e.key.toLowerCase() === "d" && hoveredPile && window.blazorHelper) {
        console.log(`Drawing top card from: ${hoveredPile.id}`);
        await window.blazorHelper.invokeMethodAsync("DrawTopCardJS", hoveredPile.id)
            .catch(() => console.warn("Blazor component is disposed."));
    }
});

window.shufflePile = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Get all shadow cards (behind the top card)
    const shadowCards = el.querySelectorAll(".card-shadow");

    shadowCards.forEach((shadow, index) => {
        // Assign a slightly different duration to each
        let duration = 0.3 + Math.random() * 0.3; // Between 0.3s - 0.6s

        // Apply shuffle animation
        shadow.style.transition = `transform ${duration}s ease-in-out`;
        shadow.style.transform = `rotate(${360 + (Math.random() * 30)}deg)`;

        // Reset after animation
        setTimeout(() => {
            shadow.style.transition = "";
            shadow.style.transform = "rotate(0deg)";
        }, duration * 1000);
    });
};
