window.onload = function() {
    // first task
    let second = 234245645335;
    second %= 3600;
    document.getElementById("seconds").innerHTML = `${parseInt(second)} seconds`;

    // second task
    let str = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, at.";
    let index_arr = [];
    for (let i = 0; i < str.length; i++) {
        if (str[i] == "a") {
            index_arr.push(i);
        }        
    }
    document.getElementById("arr").innerHTML = `indexes of "a" letter: [${index_arr}]`;
};