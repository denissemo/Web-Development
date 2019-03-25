let time = {};

function infinite_loop() {
    if (!('id' in time)) {
        time['id'] = Date.now();
    }
    if (Date.now() - time['id'] > 1000) {
        throw new Error("Infinite loop detected")
    }

}

try {
    while (true) {
        console.log("info");
        infinite_loop();
    }
} catch (e) {
    console.log(e.toString());
}
