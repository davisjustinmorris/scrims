$(document).ready(function () {
    $(`select[name="week"]`).on('change', function () {
        week = this.selectedIndex;
        score_filler();
    });
    score_filler();
});

let week = 0;
function score_filler() {
    $(`.container .teams span:not(:first-child)`).html("-");
    $(`.container .scroll .col span:not(:first-child)`).html("-");

    let ref_sorted_overall_list = [], ordered_dict = {};
    console.log("week is: ", week);

    score_matrix_team[week].forEach((a) => ref_sorted_overall_list.push(a[a.length-1]));
    ref_sorted_overall_list.sort((a,b) => b-a);
    score_matrix_team[week].forEach(function (score_array, i) {
        let total_score = score_array[score_array.length-1];
        let rank = ref_sorted_overall_list.indexOf(total_score);
        while (rank in ordered_dict) rank++;
        ordered_dict[rank.toString()] = { "team_name": teams[week][i]["name"], "scores": score_array };
    });

    // mark the teams with similar overall scores to further sort them based on Kill rating
    let sketch_set = [], last_val=null, last_key=null;
    Object.keys(ordered_dict).forEach(function (val) {
        if (last_val === ordered_dict[val]["scores"][7]){
            sketch_set.push([last_key, val]);
        }
        last_val = ordered_dict[val]["scores"][7];
        last_key = val
    });
    console.log("sketch_set", sketch_set);

    // do secondary sort/swap
    sketch_set.forEach(function (val) {
        // console.log(ordered_dict[val[0]]["scores"][6], ordered_dict[val[0]]["scores"][6]);
        if (ordered_dict[val[0]]["scores"][6] < ordered_dict[val[1]]["scores"][6]) {
            let temp = ordered_dict[val[0]];
            console.log(temp, val[0], val[1]);
            ordered_dict[val[0]] = ordered_dict[val[1]];
            ordered_dict[val[1]] = temp;
        }
    });

    for (let i=0; i<Object.keys(ordered_dict).length; i++) {
        let data = ordered_dict[i.toString()];
        $(`.teams span:not(:first-child)`)[i].innerHTML = data['team_name'];
        for (let cols=0; cols<8; cols++) {
            $(`.container .scroll .col span:nth-child(${2+i})`)[cols].innerHTML = data["scores"][cols];
        }
    }
}

let teams = [];
let score_matrix_team = [];

