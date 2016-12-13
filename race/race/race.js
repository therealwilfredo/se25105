$(document).ready(function(){


    // Canvas Variables
    var canvas = $('#canvas');
    var context = canvas.get(0).getContext('2d');
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();


    // Keyboard Variables
    var leftKey = 37;
    var upKey = 38;
    var rightKey = 39;
    var downKey = 40;


    // Keyboard event listeners
    $(window).keydown(function(e){
        var keyCode = e.keyCode;
    
        if(keyCode == leftKey){
            car.left = true;
        } else if(keyCode == upKey){
            car.forward = true;
        } else if(keyCode == rightKey){
            car.right = true;
        } else if (keyCode == downKey){
            car.backward = true;
        }
    });
    $(window).keyup(function(e){
        var keyCode = e.keyCode;
        if(keyCode == leftKey){
            car.left = false;
        } else if(keyCode == upKey){
            car.forward = false;
        } else if(keyCode == rightKey){
            car.right = false;
        } else if (keyCode == downKey){
            car.backward = false;
        }
    });


    // Start & Stop button controlls
    var playAnimation = true;
    
    var startButton = $('#startAnimation');
    var stopButton = $('#stopAnimation');
    
    startButton.hide();
    startButton.click(function(){
        $(this).hide();
        stopButton.show();
        playAnimation = true;
        updateStage();
    });
    stopButton.click(function(){
        $(this).hide();
        startButton.show();
        playAnimation = false;
    });

    
    // Resize canvas to full screen
    function resizeCanvas(){
        canvas.attr('width', $(window).get(0).innerWidth);
        canvas.attr('height', $(window).get(0).innerHeight);
        canvasWidth = canvas.width();
        canvasHeight = canvas.height();
    }
    resizeCanvas();
    $(window).resize(resizeCanvas);


    function initialise(){
        initStageObjects();
        drawStageObjects();
        updateStage();
    }
    

    // Car object and properties
    function Car(src, x, y){        
        this.image = new Image();
        this.image.src = src;
        
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 90;
    
        this.topSpeed = 15;
        this.acceleration = 0.1;
        this.reverse = 0.1;
        this.brakes = 0.3;
        this.friction = 0.05;
        this.handeling = 15;
        this.grip = 15;
        this.minGrip = 5;
        this.speed = 0;
        this.drift = 0;
    
        this.left = false;
        this.up = false;
        this.right = false;
        this.down = false;
    }
            
    
    // Create any objects needed for animation        
    function initStageObjects(){
        car = new Car('http://www.henry.brown.name/experiments/foundation-canvas/images/car.png',canvas.width()/2,canvas.height()/2);
    }
    
    
    function drawStageObjects(){
        context.save();
        context.translate(car.x,car.y);
        context.rotate((car.angle + car.drift) * Math.PI/180);    
        
        context.drawImage(car.image, -25 , (-47 + (Math.abs(car.drift / 3))));    
        
        // context.fillRect(-5, -5, 10, 10);
        context.restore();
        
    }
    
    
    function clearCanvas(){
        context.clearRect(0, 0, canvasWidth, canvasHeight);  
        context.beginPath();
    }
    
    
    function updateStageObjects(){
        
        // Faster the car is going, the worse it handels
        if(car.handeling > car.minGrip){
            car.handeling = car.grip - car.speed;
        }
        else{
            car.handeling = car.minGrip + 1;
        }
        
        
        // Car acceleration to top speed
        if(car.forward){
            if(car.speed < car.topSpeed){
                car.speed = car.speed + car.acceleration;
            }            
        }        
        else if(car.backward){
            if(car.speed < 1){
                car.speed = car.speed - car.reverse;    
            }
            else if(car.speed > 1){
                car.speed = car.speed - car.brakes;
            }
        }
        
        
        // Car drifting logic (it's crap, needs work)
        if(car.forward && car.left){
            if(car.drift > -35){
                car.drift = car.drift - 3;    
            }
        }
        else if(car.forward && car.right){
            if(car.drift < 35){
                car.drift = car.drift + 3;    
            }
        }
        else if(car.forward && !car.left && car.drift > -40 && car.drift < -3){
            car.drift = car.drift + 3;
        }
        else if(car.forward && !car.right && car.drift < 40 && car.drift > 3){
            car.drift = car.drift - 3;
        }
        
        if(car.drift > 3){
            if(!car.forward && !car.left){
                car.drift = car.drift - 4;
            }
        }

        else if(car.drift > -40 && car.drift < -3){
            if(!car.forward && !car.right){
                car.drift = car.drift + 4;
            }
        }
        

        // General car handeling when turning    
        if(car.left){
            car.angle = car.angle - (car.handeling * car.speed/car.topSpeed);

        } else if(car.right){
            car.angle = car.angle + (car.handeling * car.speed/car.topSpeed);    

        }
        
        
        // Use this div to display any info I need to see visually
        $('#stats').html(car.drift);
            
        
        // Constant application of friction / air resistance
        if(car.speed > 0){
            car.speed = car.speed - car.friction;
        } else if(car.speed < 0) {
            car.speed = car.speed + car.friction;
        }
        

        // Update car velocity (speed + direction)
        car.vy = -Math.cos(car.angle * Math.PI / 180) * car.speed;
        car.vx = Math.sin(car.angle * Math.PI / 180) * car.speed;    
        
        // Plot the new velocity into x and y cords
        car.y = car.y + car.vy;
        car.x = car.x + car.vx;
    }


    // Main animation loop
    function updateStage(){
        clearCanvas();
        updateStageObjects();
        drawStageObjects();        
        
        if(playAnimation){
            setTimeout(updateStage, 25);
        }
    }
    
    
    // Initialise the animation loop
    initialise();
        
});