function timer_start(){
    if(use_new_timer){
        if(timer_type == "study"){
            hours = 0 + hours_study_number.value;
            minutes = 0 + minutes_study_number.value;
            seconds = 0 + seconds_study_number.value;
        }
        else{
            hours = 0 + hours_rest_number.value;
            minutes = 0 + minutes_rest_number.value;
            seconds = 0 + seconds_rest_number.value;
        }
        change_display();
    }

    if(timer_type == "study"){start_wave();}

    use_new_timer = false;

    document.getElementById("set").disabled = "disabled";
    
    var timer_button = document.getElementById("start_stop");
    timer_button.innerText = "ストップ";
    timer_button.setAttribute("onclick","timer_stop()");

    timer = setInterval(function(){
        seconds--;

        if(seconds<=-1){
            minutes--;
            seconds = 59;
        }
        if(minutes<=-1){
            hours--;
            minutes = 59;
        }
        if(hours<=-1){
            hours = 0;
            if(timer_type == "study"){
                audio.play().catch(err => {
                    console.error("再生できませんでした:", err);
                  })
                timer_type = "rest";
                timer_stop();
            }
            else{
                timer_type = "study";
                start_wave();
                timer_stop();
            }
            use_new_timer = true;
            timer_start();
        }
        total_seconds++;
        if(total_seconds>=60){
            total_minutes++;
            total_seconds=0;
        }
        if(total_minutes>=60){
            total_hours++;
            total_minutes=0;
        }
        change_display();
    },1000);
}
function timer_stop(){
    clearInterval(timer);
    if(osc){stop_wave();}
    
    document.getElementById("set").disabled = null;
    var timer_button = document.getElementById("start_stop");
    timer_button.innerText = "スタート";
    timer_button.setAttribute("onclick","timer_start()");
}
function timer_set(){
    
    hours = 0 + hours_study_number.value;
    minutes = 0 + minutes_study_number.value;
    seconds = 0 + seconds_study_number.value;
    change_display();
    use_new_timer = true;
    timer_type = "study";
}
function total_reset(){
    total_hours=0;
    total_minutes=0;
    total_seconds=0;
    total_time.innerText = total_hours +":"+ ("0"+total_minutes).slice(-2) +":"+ ("0"+total_seconds).slice(-2);
}
function recommend_setting(){
    frequency_slider.value = 1200;
    frequency_number.value = 1200;
    volume_slider.value = 100;
    volume_number.value = 100;
    waveform.value = 'sine';
    hours_study_slider.value = 0;
    hours_study_number.value = 0;
    minutes_study_slider.value = 25;
    minutes_study_number.value = 25;
    seconds_study_slider.value = 0;
    seconds_study_number.value = 0;
    hours_rest_slider.value = 0;
    hours_rest_number.value = 0;
    minutes_rest_slider.value = 5;
    minutes_rest_number.value = 5;
    seconds_rest_slider.value = 0;
    seconds_rest_number.value = 0;
}

function change_slider(e){
    console.log(e);
    var number = (e.target.id);
    var slider = number.replace("_number","_slider");

    document.getElementById(slider).value = document.getElementById(number).value;
    change_display();
}
function change_number(e){
    var slider = (e.target.id)
    var number = slider.replace("_slider","_number");

    document.getElementById(number).value = document.getElementById(slider).value;
    change_display();
}
function change_display(){
    time_display.innerText = ("0"+hours).slice(-2) +":"+ ("0"+minutes).slice(-2) +":"+ ("0"+seconds).slice(-2);
    total_time.innerText = total_hours +":"+ ("0"+total_minutes).slice(-2) +":"+ ("0"+total_seconds).slice(-2);
}

function start_wave(){
    if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(!osc){
        osc = ctx.createOscillator();
        osc.type = waveform.value;
        osc.frequency.value = frequency_number.value;

        let gainNode = ctx.createGain();
        gainNode.gain.value = volume_number.value / 100;

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
    }
}
function stop_wave(){
    osc.stop();
    osc.disconnect();
    osc = null;
}

let ctx;
let osc;

const audio = new Audio("目覚まし時計のアラーム.mp3");

var use_new_timer = true;
var hours = 0;
var minutes = 0;
var seconds = 0;
var total_hours = 0;
var total_minutes = 0;
var total_seconds = 0;
var timer;
var timer_type = "study";
let hours_study_number = document.getElementById("hours_study_number");
let minutes_study_number = document.getElementById("minutes_study_number");
let seconds_study_number = document.getElementById("seconds_study_number");
let hours_study_slider = document.getElementById("hours_study_slider");
let minutes_study_slider = document.getElementById("minutes_study_slider");
let seconds_study_slider = document.getElementById("seconds_study_slider");
let hours_rest_number = document.getElementById("hours_rest_number");
let minutes_rest_number = document.getElementById("minutes_rest_number");
let seconds_rest_number = document.getElementById("seconds_rest_number");
let hours_rest_slider = document.getElementById("hours_rest_slider");
let minutes_rest_slider = document.getElementById("minutes_rest_slider");
let seconds_rest_slider = document.getElementById("seconds_rest_slider");
let time_display = document.getElementById("time_display");
let total_time = document.getElementById("total_time");

let frequency_number = document.getElementById("frequency_number");
let frequency_slider = document.getElementById("frequency_slider");
let volume_number = document.getElementById("volume_number");
let volume_slider = document.getElementById("volume_slider");
let waveform = document.getElementById("waveform");

hours_study_number.addEventListener("input", change_slider);
minutes_study_number.addEventListener("input", change_slider);
seconds_study_number.addEventListener("input", change_slider);
hours_rest_number.addEventListener("input", change_slider);
minutes_rest_number.addEventListener("input", change_slider);
seconds_rest_number.addEventListener("input", change_slider);
hours_study_slider.addEventListener("input", change_number);
minutes_study_slider.addEventListener("input", change_number);
seconds_study_slider.addEventListener("input", change_number);
hours_rest_slider.addEventListener("input", change_number);
minutes_rest_slider.addEventListener("input", change_number);
seconds_rest_slider.addEventListener("input", change_number);

frequency_number.addEventListener("input",change_slider);
frequency_slider.addEventListener("input",change_number);
volume_number.addEventListener("input",change_slider);
volume_slider.addEventListener("input",change_number);
