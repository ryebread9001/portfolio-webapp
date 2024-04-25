async function main() {
    let response = await fetch('/esp-data');
    let resJSON = await response.json();
    let isOn = resJSON; //let ESPvals = {"red": false,"yellow":false,"green":false,"blue":false,"white":false,"B1":false,"B2":false};
    console.log(resJSON)
    let trigger = document.getElementById('trigger');
    if (isOn) {
        trigger.classList.add('btn-primary')
    } else {
        trigger.classList.add('btn-secondary')
    }
    
    trigger.addEventListener("click", ()=> {
        isOn = !isOn;
        if (!isOn) {
            trigger.classList.remove('btn-primary')
            trigger.classList.add('btn-secondary')
        } else {
            trigger.classList.remove('btn-secondary')
            trigger.classList.add('btn-primary')
            
        }
        updateServer(isOn);
    })
    
    function updateServer(val) {
        fetch("/esp-data?val=" + val, {method: "POST"})
    }
}

main();

