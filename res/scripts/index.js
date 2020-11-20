$(document).ready(function () {
    fetch(undefined, () => { filler(selected_week, "slots") }, "slots");
    fetch(undefined, () => { filler(selected_week, "scores") }, "scores");

    $(`nav li`).on('click', function () {
        $(`nav li`).removeClass('active');
        $(`main > .container`).removeClass('active');
        $(this).addClass("active");
        $(`main > .container.${this.id}`).addClass('active');
        filler(selected_week, this.id);
    });
});


const DOMAIN = "http://localhost:5000"
const FETCH_SLOTS_PATH = "/api/get_slots"
const FETCH_SCORES_PATH = "/api/get_scores"

let json_db = {}
let selected_week = null;

function fetch(req_week, callback, target) {
    let path = DOMAIN;
    if (target === undefined)   target = $('nav li.active')[0].id;
    if (target === "slots")     path += FETCH_SLOTS_PATH;
    else                        path += FETCH_SCORES_PATH;

    if (req_week === undefined) req_week = "";
    else                        req_week = "/" + req_week;

    $.ajax(
        path + req_week,
        {
            method: "get",
            success: function (data, status) {
                if (status === "success") {
                    console.log("ajax data: ", data);
                    let week = Object.keys(data)[0];
                    let entity = Object.keys(data[week])[0];
                    console.log(`week: ${week}, entity: ${entity}`);

                    if (!json_db.hasOwnProperty(week)) json_db[week] = {};
                    json_db[week][entity] = data[week][entity];

                    // getting latest week & populate week <select>-<option>
                    if (req_week === "" && selected_week === null) week_sel_init(week);
                    console.log(json_db);

                    if (callback !== undefined) callback();
                }
            },
            error: function (data, status) {
                console.log("error status: ", status);
                console.log("error data: ", data);
            }
        }
    );
}

function filler(week, target) {
    console.log(`score filler invoked with week: ${week} & target: ${target} & json: `);
    console.log(json_db);

    if (target === undefined) target = $('nav li.active')[0].id;
    $(`.container .teams span:not(:first-child)`).html("-");
    $(`.container .scroll .col span:not(:first-child)`).html("-");

    if (!json_db.hasOwnProperty(week)) {
        fetch(week, () => filler(week, target));
        return ;
    } else if (!json_db[week].hasOwnProperty($('nav li.active')[0].id)) {
        fetch(week, () => filler(week, target));
        return ;
    }

    if (target === "scores") {
        let i = 2;
        json_db[week]["scores"].forEach(function (each_val) {
            $(`.teams span:nth-child(${i})`).html(each_val[0]);
            for (let cols = 0; cols < 8; cols++)
                if (each_val[cols + 1] !== null)
                    $(`.container .scroll .col span:nth-child(${i})`)[cols].innerHTML = each_val[cols + 1];
            i++;
        });
    } else if (target === "slots") {
        let arr_size = json_db[week]["slots"].length;
        let col_tg;

        $(`main .slots .col`).empty();
        json_db[week]["slots"].forEach(function (val, i) {
            if (arr_size % 2 === 0){
                if (i/arr_size < 0.5)       col_tg = 1;
                else                        col_tg = 2;
            } else {
                if (i/(arr_size-1) < 0.5)   col_tg = 1;
                else                        col_tg = 2;
            }
            $(`main .slots .col:nth-child(${col_tg})`).append(
           `<div>
                <span>${val[0]}</span>
                <div class="im_con"><img src="${val[2]}" alt=""></div>
                <span>${val[1]}</span>
            </div>`
            );
        });
    } else console.log("ASSERT ERROR!");
}

function week_sel_init(target_week) {
    selected_week = target_week;

    let inject = `<select name="week">`
    for (let i=1; i<=parseInt(target_week); i++)
        inject += `\n<option value="week${i}">Week ${i}</option>`
    inject += `\n</select>`;

    console.log("injecting week selection & setting sel_week", target_week);
    $('.week').html(inject);
    $('.week select option:last-child').prop("selected", true)
    $(`select[name="week"]`).on('change', week_sel_change_listener);
}

function week_sel_change_listener(){
    selected_week = (this.selectedIndex + 1).toString();
    filler(selected_week);
}