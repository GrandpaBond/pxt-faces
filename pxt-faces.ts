/**
 * an extension for making faces...
 */
//% color=#c088e0 weight=100 icon="\uf118" block="Faces"
namespace faces {
    // CONSTANTS & ENUMS...

    /* eyes use these pixel-map contributions
         ______        _______
        | 1   2|   4  | 8  16 |
        |32  64| 128  |256 512|
         ******        *******

    
    The value of each Eye Enum is a two-row bitmap for just the 
    left eye pattern. The right eye will need {map} << 3
    We use bothEyes({left},{right}) to get the complete bitmap
    */
    enum Eye {
        Up = (1 + 2),
        Down = (32 + 64),
        Left = (1 + 32),
        Right = (2 + 64),
        All = (1 + 2 + 32 + 64)
    }

    // USER INTERFACE DROP-Down ENUMS

    // EYES: (the value of each Enum is a two-row bitmap)
    export enum Eyes {
        //% block="open"
        Open = 891,
        //% block="sad"
        Sad = 874,
        //% block="shut"
        Shut = 864,
        //% block="mad"
        Mad = 347,
        //% block="up"
        Up = 27,
        //% block="pop"
        Pop = 561,
        //% block="left"
        Left = 297,
        //% block="right"
        Right = 594
    };

    //MOUTHS: use these pixel-map contributions
    //       1    2    4    8   16  
    //      32   64  128  256  512 
    //      1K   2K   4K   8K  16K  
    export enum Mouth {
        //% block="flat"
        Flat = 448,
        //% block="ok"
        Ok = 4416,
        //% block="grin"
        Grin = 14880,
        //% block="sulk"
        Sulk = 17856,
        //% block="hmmm"
        Hmmm = 14464,
        //% block="open"
        Open = 4420,
        //% block="left"
        Left = 6240,
        //% block="right"
        Right = 13056,
        //% block="shout"
        Shout = 14660,
        //% block="laugh"
        Laugh = 15204,
        //% block="smirk"
        Smirk = 6944,
        //% block="kiss"
        Kiss = 128
    };

    export enum EyesV {
        //% block="up"
        Up,
        //% block="level"
        Level,
        //% block="down"
        Down
    };

    export enum EyesH {
        //% block="left"
        Left,
        //% block="ahead"
        Ahead,
        //% block="right"
        Right,
        //% block="inwards"
        Inwards,
        //% block="outwards"
        Outwards
    };

    // LOW_LEVEL TOOLS
    function bothEyes(left: Eye, right: Eye): number {
        return (left + (right << 3))
    }

    /* Use a bitmap to plot LEDs on/off in a subset of display-rows 
    (the top two for eyes; the bottom three for mouths).
    To optimise performance, bits are mapped low-endian and row-wise in
    groups of 5, (top-left pixel as the LSB; bottom-Right pixels as the MSB). 
    So for a 2-row pair of eyes, the pixel contributions are:
            1   2   4   8  16
            32  64 128 256 512
    */
    function showBitmap(bitmap: number, rows: number, start: number) {
        for (let y = start; y < (start + rows); y++) {
            for (let x = 0; x < 5; x++) {
                if (bitmap & 1) {
                    led.plot(x, y);
                } else {
                    led.unplot(x, y);
                }
                bitmap >>= 1;
            }
        }
    }
    // change back to [myEyes, myMouth] after temporary expression
    function revertAfter(ms: number) {
        reverting = true; // defend against overlapping instances
        pause(ms);
        if (reverting) {  // revert, unless another instance already did this...
            reverting = false;
            showBitmap(myEyes, 2, 0);
            litEyes = myEyes;
            showBitmap(myMouth, 3, 2);
        }
    }

    // Background blinker: periodically shuts eyes, waits a bit,
    // then re-displays not myEyes, but litEyes. (This allows a blink to
    // occur even during a temporary eye-change, such as a glance or a wink) 
    function blinker() {
        if (!blinking) { // defend against overlapping instances
            blinking = true;
            while (blinkGap > 0) {
                showBitmap(Eyes.Shut, 2, 0);
                pause(blinkTime);
                showBitmap(litEyes, 2, 0);
                // ~1 in 6 blinks are doubled and ~1 in 18 get trebled
                if (randint(0, 9) == 0) {
                    pause(150);
                    showBitmap(Eyes.Shut, 2, 0);
                    pause(blinkTime);
                    showBitmap(litEyes, 2, 0);
                }
                if (randint(0, 9) == 0) {
                    pause(150);
                    showBitmap(Eyes.Shut, 2, 0);
                    pause(blinkTime);
                    showBitmap(litEyes, 2, 0);
                }

                // apply some jitter to time between blinks
                let percent = 100 + randint(0, 2 * blinkVary) - blinkVary;
                let time = blinkGap * percent / 100;
                pause(time);
            } // (keep blinking until blinkGap set to zero)
            blinking = false;
        } // else there's a blinker already running
    }

    // range-clamper:
    function clamp(bottom: number, input: number, top: number): number {
        return (Math.max(bottom, Math.min(input, top)));
    }


    // EXPORTED USER INTERFACES  

    /**
     * show the selected face on the LED display
     * @param eyes choice of eyes
     * @param mouth choice of mouth
     * @param ms for how long (if temporary change)
     * @param wait if true: wait, else return immediately
     */
    //% block="show face: eyes= $eyes, mouth= $mouth|| for (ms) $ms| wait? $wait"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% ms.shadow="timePicker"
    //% ms.defl=0
    //% wait.shadow="toggleYesNo"
    //% wait.defl=true
    //% weight=90
    export function showFace(eyes: Eyes, mouth: Mouth, ms: number = 0, wait: boolean = true) {
        showBitmap(eyes, 2, 0);
        litEyes = eyes;
        showBitmap(mouth, 3, 2);
        if (ms == 0) { // permanent change
            myEyes = eyes;
            myMouth = mouth;
        } else { // temporary change
            ms = clamp(100, ms, 10000);
            if (wait) {
                revertAfter(ms);
            } else {
                control.inBackground(function () { revertAfter(ms) });
            }
        }
    }

    /**
     * show the selected eyes on the LED display
     * @param eyes choice of eyes
     * @param ms for how long (if temporary change)
     * @param wait if true: wait, else return immediately
     */
    //% block="show eyes: $eyes|| for (ms) $ms| wait? $wait"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% ms.shadow="timePicker"
    //% ms.defl=0
    //% wait.shadow="toggleYesNo"
    //% wait.defl=true
    //% weight=80
    export function showEyes(eyes: Eyes, ms: number = 0, wait: boolean = true) {
        showBitmap(eyes, 2, 0);
        litEyes = eyes;
        if (ms == 0) { // permanent change
            myEyes = eyes;
        } else { // temporary change
            ms = clamp(100, ms, 10000);
            if (wait) {
                revertAfter(ms);
            } else {
                control.inBackground(function () { revertAfter(ms) });
            }
        }
    }

    /**
     * show the selected mouth on the LED display
     * @param mouth choice of mouth
     * @param ms for how long (if temporary change)
     * @param wait if true: wait, else return immediately
     */
    //% block="show mouth: $mouth|| for (ms) $ms| wait? $wait"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% ms.shadow="timePicker"
    //% ms.defl=0
    //% wait.shadow="toggleYesNo"
    //% wait.defl=true
    //% weight=70
    export function showMouth(mouth: Mouth, ms: number = 0, wait: boolean = true) {
        showBitmap(mouth, 3, 2);
        if (ms == 0) { // permanent change
            myMouth = mouth;
        } else { // temporary change
            ms = clamp(100, ms, 10000);
            if (wait) {
                revertAfter(ms);
            } else {
                control.inBackground(function () { revertAfter(ms) });
            }
        }
    }

    /**
     * look in the chosen direction
     * @param upDown vertical eye-position
     * @param leftRight horizontal eye-position
     * @param ms for how long (if a temporary glance)
     * @param wait if true: wait, else return immediately
     */
    //% block="look $upDown $leftRight|| for (ms) $ms| wait? $wait"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% ms.shadow="timePicker"
    //% ms.defl=0
    //% wait.shadow="toggleYesNo"
    //% wait.defl=true
    //% weight=60
    export function look(upDown: EyesV, leftRight: EyesH, ms: number = 0, wait: boolean = true) {
        let eyeMap = 0;
        if ((upDown == EyesV.Level) && (leftRight == EyesH.Ahead)) {
            eyeMap = Eye.All + (Eye.All << 3);
        } else {
            switch (upDown) {
                case EyesV.Up: eyeMap = Eye.Up + (Eye.Up << 3);
                    break;
                case EyesV.Level:
                    break;
                case EyesV.Down: eyeMap = Eye.Down + (Eye.Down << 3);
                    break;
            }
            switch (leftRight) {
                case EyesH.Left:
                    eyeMap |= Eye.Left + (Eye.Left << 3);
                    break;
                case EyesH.Ahead:
                    break;
                case EyesH.Right:
                    eyeMap |= Eye.Right + (Eye.Right << 3);
                    break;
                case EyesH.Inwards:
                    eyeMap |= Eye.Right + (Eye.Left << 3);
                    break;
                case EyesH.Outwards:
                    eyeMap |= Eye.Left + (Eye.Right << 3);
                    break;
            }
        }
        showBitmap(eyeMap, 2, 0);
        litEyes = eyeMap;
        if (ms == 0) { // permanent change
            myEyes = eyeMap;
        } else { // temporary change
            ms = clamp(100, ms, 10000);
            if (wait) {
                revertAfter(ms);
            } else {
                control.inBackground(function () { revertAfter(ms) });
            }
        }
    }


    /**
     * wink an eye for a short time
     * @param isLeft if true, wink the left eye, else the right one
     * @param ms for how long (default is 750 ms)
     * @param wait if true: wait, else return immediately

     */
    //% block="wink: left Eye? $isLeft|| for (ms) $ms| wait? $wait"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% isLeft.shadow="toggleYesNo"
    //% isLeft.defl=true
    //% ms.shadow="timePicker"
    //% ms.defl=750
    //% wait.shadow="toggleYesNo"
    //% wait.defl=true
    //% weight=50
    export function wink(isLeft: boolean, ms: number = 750, wait: boolean = true) {
        let leftEye = myEyes & Eye.All;
        let rightEye = (myEyes >> 3) & Eye.All;
        let winking = bothEyes(leftEye, Eye.Down);
        if (isLeft) {
            winking = bothEyes(Eye.Down, rightEye);
        }
        showBitmap(winking, 2, 0);
        litEyes = winking;
        ms = clamp(100, ms, 10000);
        if (wait) {
            revertAfter(ms);
        } else {
            control.inBackground(function () { revertAfter(ms) });
        }
    }

    /**
     * roll the eyes in either direction
     * @param clockwise clockwise if true, else anti-clockwise
     */
    //% block="roll eyes: clockwise? $clockwise"
    //% clockwise.shadow="toggleYesNo"
    //% clockwise.defl=true
    //% weight=40
    export function rollEyes(clockwise: boolean = true) {
        if (clockwise) {
            look(EyesV.Up, EyesH.Left, 150);
            look(EyesV.Up, EyesH.Ahead, 150);
            look(EyesV.Up, EyesH.Right, 150);
            look(EyesV.Level, EyesH.Right, 150);
            look(EyesV.Down, EyesH.Right, 150);
            look(EyesV.Down, EyesH.Ahead, 150);
            look(EyesV.Down, EyesH.Left, 150);
            look(EyesV.Level, EyesH.Left, 150);
        } else {
            look(EyesV.Up, EyesH.Right, 150);
            look(EyesV.Up, EyesH.Ahead, 150);
            look(EyesV.Up, EyesH.Left, 150);
            look(EyesV.Level, EyesH.Left, 150);
            look(EyesV.Down, EyesH.Left, 150);
            look(EyesV.Down, EyesH.Ahead, 150);
            look(EyesV.Down, EyesH.Right, 150);
            look(EyesV.Level, EyesH.Right, 150);
        }
        // restore current eyes
        showBitmap(myEyes, 2, 0);
        litEyes = myEyes;
    }

    /**
         * blink occasionally (or stop)
         * @param gap average millisecs between blinks (0 to stop)
         * @param vary the maximum % random +/- variation in gap
         * @param ms new length of a blink (in millisecs)
         */
    //% block="blink every $gap ms|| +/- percent: $vary| for (ms) $ms"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% gap.shadow="timePicker"
    //% gap.defl=2000
    //% vary.min=0 vary.max=99 vary.defl=75
    //% ms.defl=125
    //% ms.shadow="timePicker"
    //% weight=30
    export function blink(gap: number, vary: number = 75, ms: number = 125) {
        if (gap != 0) {
            gap = clamp(100, gap, 10000);
        }
        blinkGap = gap; // (zero teminates any active blinker)
        blinkVary = clamp(0, vary, 99);
        blinkTime = clamp(100, ms, 1000);
        if (!blinking && (blinkGap > 0)) {
            control.inBackground(function () { blinker() });
        }
    }

    /**
     * stop showing a face
     */
    //% block="hide face"
    //% weight=20
    export function hide_face() { 
    // ensure we thwart any pending blinker or reverter too
        myEyes = 0;
        myMouth = 0;
        litEyes = 0;
        blinkGap = 0;
        blinking = false;
        reverting = false;
        basic.clearScreen();
    }

    // INITIALISE

    let myEyes = 0;
    let myMouth = 0;
    let litEyes = 0;
    let reverting = false;
    let blinking = false;
    let blinkGap = 0;
    let blinkVary = 0;
    let blinkTime = 125;
}