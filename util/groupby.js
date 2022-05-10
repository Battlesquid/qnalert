module.exports = (arr, prop) => {
    const grouped = {};
    arr.forEach(el => Array.isArray(grouped[el[prop]])
        ? grouped[el[prop]].push(el)
        : grouped[el[prop]] = [el]
    );
    return grouped;
};
