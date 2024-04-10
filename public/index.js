const containers = document.querySelectorAll('.px3');

function resizeBody() {
    if (containers.length > 0) {
        containers.forEach((el)=>{
            if (window.innerWidth < 1250) {
                el.classList.remove('px3');
            } else {
                el.classList.add('px3');
            }
        })
    }
};

window.onresize = resizeBody;
window.onload = resizeBody;