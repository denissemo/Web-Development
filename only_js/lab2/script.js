function isEmpty(obj) {
    if (Object.keys(obj) != 0) {
        return true;
    } else {
        return false;
    }
}

console.log(isEmpty({}));