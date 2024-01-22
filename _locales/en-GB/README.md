```package
faces=github:grandpabond/pxt-faces
```

# Faces Extension
We all like to use Emojis to express what we are feeling.
Let your micro:bit do the same with the ``||faces:faces||`` extension!

Sometimes a change of expression is only temporary (like a laugh or a wink).
Other times it shows a more permanent change of mood (like a sulk).
Your micro:bit may want to run some other code while temporarily changing its expression.
All of the blocks let you either wait or return immediately, undoing the temporary change in the background.  

Your micro:bit will appear much more lifelike if it blinks occasionally. 
You can turn blinking on or off, and even change its rate and predictability.

## Showing a Face
```sig
faces.showFace(eyes,mouth)
```
This block displays a new face with a selected expression.

> ``||faces:eyes||`` - chooses from a selection of eyes.

> ``||faces:mouth||`` - chooses which mouth to show.

If you repeatedly click on the "+", you can set optional parameters:

> ``||faces:ms||`` - if greater than zero, this says how long (in microsecs) to temporarily 
show the new face, before going back to the previous expression.

> ``||faces:wait||`` - (a boolean) if true: wait, else return immediately

## Changing the Eyes
```sig
faces.showEyes(eyes)
```
This block changes just the eyes on your micro:bit's face.

> ``||faces:eyes||`` - chooses from a selection of eyes.

If you repeatedly click on the "+", you can set optional parameters:

> ``||faces:ms||`` - if greater than zero, this says how long (in microsecs) to temporarily 
show the new eyes, before going back to the previous expression.

> ``||faces:wait||`` - (a boolean) if true: wait, else return immediately

## Changing the Mouth
```sig
faces.showMouth(mouth)
```
This block changes just the mouth on your micro:bit's face.

> ``||faces:mouth||`` - chooses from a selection of different mouth shapes.

If you repeatedly click on the "+", you can set optional parameters:

> ``||faces:ms||`` - if greater than zero, this says how long (in microsecs) to temporarily 
show the new mouth, before going back to the previous expression.

> ``||faces:wait||`` - (a boolean) if true: wait, else return immediately

## Looking Around
```sig
faces.look(upDown,leftRight)
```
This block adjusts the eyes to look in a chosen direction.

> ``||faces:upDown||`` - adjusts them vertically.

> ``||faces:leftRight||`` - adjusts them horizonally.

If you repeatedly click on the "+", you can set optional parameters:

> ``||faces:ms||`` - if greater than zero, this says how long (in microsecs) to temporarily 
glance in the chosen direction.

> ``||faces:wait||`` - (a boolean) if true: wait, else return immediately

## Rolling the Eyes
```sig
faces.rollEyes(direction)
```
This block rolls the eyes in the chosen direction.

> ``||faces:clockwise||`` - clockwise if true, else anti-clockwise.


## Winking
```sig
faces.wink(isLeft, ms, wait)
```
This block lets you wink the chosen eye, regardless of what face is currently showing.
The default wink takes 750ms, but you can optionally change this.

> ``||faces:isLeft||`` - (a boolean) if true: winks the left eye, else the right.

If you repeatedly click on the "+", you can set optional parameters:

> ``||faces:ms||`` - if greater than zero, this says how long (in microsecs) to wink for,
 before going back to the previous expression.

> ``||faces:wait||`` - (a boolean) if true: wait, else return immediately


### ~reminder
NOTE: when selecting eyes, it is **our** left & right, not the micro:bit's !
### ~

## Blinking
```sig
faces.blink(gap: number, vary: number, ms: number)
```
This block lets you control blinking, helping to show mood. A faster blink-rate appears 
more agitated. Longer blinks might indicate boredom or sleepiness. Random changes to the 
gap between blinks makes your micro:bit much more lifelike. For additional realism, there 
are occasional double or even treble blinks.

> ``||faces:gap||`` - the average time (in millisecs) between blinks (if zero, stop blinking)

> ``||faces:vary||`` - the random variation in spacing of blinks (maximum +/- percentage) 

If you click on the "+", you can set an optional parameter: 

> ``||faces:ms||`` - new length of a blink (in millisecs)


## Finished showing Faces?
```sig
faces.hideFace()
```
If you need to use the LED display for other purposes, this block lets you stop showing a face.
It also stops any pending background actions such as temporary expression-changes or blinking.


## Examples
Typically, the faces your micro:bit makes might be in response to various external stimuli, 
such as light, noise, temperature, tilting or shaking;  --or maybe simply getting bored or sleepy!.

### Mood-changes
Here is a very simple example to show some of the ``||faces:faces||`` blocks in use.

```blocks
// example script
faces.showFace(faces.Eyes.Open, faces.Mouth.Grin)
faces.blink(4000, 80, 250)
basic.pause(5000)
// sing wedding march
faces.showMouth(faces.Mouth.Open, 8000, false)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wedding), music.PlaybackMode.InBackground)
basic.pause(5000)
// change mood progressively to angry
faces.blink(500, 80, 100)
faces.showFace(faces.Eyes.Open, faces.Mouth.Flat)
basic.pause(2000)
faces.showFace(faces.Eyes.Up, faces.Mouth.Hmmm, 500)
basic.pause(2000)
faces.rollEyes(true)
faces.rollEyes(true)
basic.pause(2000)
faces.showFace(faces.Eyes.Mad, faces.Mouth.Sulk)
basic.pause(2000)
// shout funeral march
faces.showMouth(faces.Mouth.Shout, 4000, false)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funeral), music.PlaybackMode.InBackground)
basic.pause(5000)
// recover...
faces.showFace(faces.Eyes.Open, faces.Mouth.Flat)
faces.blink(0)
basic.pause(3000)
// happier now...
faces.showFace(faces.Eyes.Open, faces.Mouth.Ok)
basic.pause(5000)
// finish with a wink
faces.wink(false, 1000)
basic.pause(5000)
```
After showing a happy face for 5 seconds with slow blinking turned on, the mouth is opened 
to sing the Wedding March (closing automatically after 8 seconds).

After a short pause, the mood progressively changes: blinking speeds up, the eyes roll, and an angry face is shown.

Again, the mouth is opened while the Funeral March is shouted-out.

Because the mouth-change was only temporary, after 5 seconds the mouth automatically changes back to sulking.

Then, after a 5-second pause, the mood gradually recovers, blinking is switched off and a happier face returns, 
finally giving us a slow wink.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
> Open this page at [https://grandpabond.github.io/pxt-faces/](https://grandpabond.github.io/pxt-faces/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/grandpabond/pxt-faces** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/grandpabond/pxt-faces** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
