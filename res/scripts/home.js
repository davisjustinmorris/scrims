let week = 1;

$(document).ready(function () {
    $('select[name="week"]').on("change", function () { week = this.selectedIndex; loadSlots(); });


});

function loadSlots() {
    if (week === 0) {
        for (let i=0; i<10; i++){
            console.log("i: ", i);
            let item1 = $(`.container > .col:first-child > div:nth-child(${i+1})`);
            item1.find('span:first-child').html(teams[0][i]["slot"]);
            item1.find('span:last-child').html(teams[0][i]["name"]);
            item1.find('img').prop("src", teams[0][i]["dp"]);
        }
        for (let i=10; i<20; i++) {
            console.log("i: ", i);
            let item1 = $(`.container > .col:last-child > div:nth-child(${i-9})`);
            item1.find('span:first-child').html(teams[0][i]["slot"]);
            item1.find('span:last-child').html(teams[0][i]["name"]);
            item1.find('img').prop("src", teams[0][i]["dp"]);
        }
        $(`.container > .col:last-child > div:last-child`).prop("style", 'visibility: visible');
    } else if (week === 1 || week === 2) {
        for (let i=0; i<10; i++){
            console.log("> i: ", i);
            let item1 = $(`.container > .col:first-child > div:nth-child(${i+1})`);
            item1.find('span:first-child').html(teams[1][i]["slot"]);
            item1.find('span:last-child').html(teams[1][i]["name"]);
            item1.find('img').prop("src", teams[1][i]["dp"]);
        }
        for (let i=10; i<20; i++) {
            console.log(">> i: ", i);
            let item1 = $(`.container > .col:last-child > div:nth-child(${i-9})`);
            item1.find('span:first-child').html(teams[1][i]["slot"]);
            item1.find('span:last-child').html(teams[1][i]["name"]);
            item1.find('img').prop("src", teams[1][i]["dp"]);
        }
        $(`.container > .col:last-child > div:last-child`).prop("style", 'visibility: hidden');
    }
}

let teams = [];