Buttons are touchable elements used to interact with the screen. They may display text, icons, or both. Buttons can be styled with several props to look a specific way.

props
1)onPress:
button click handler
type=function

2)full:
if passed makes the button width 90 percent
type=boolean

3)half:
if passed makes the button width 45 percent
type=boolean

4)quarter:
if passed makes the button width 25 percent
type=boolean

5)buttonStyle:
add additional styling for button component
type=object or array

6)containerStyle:
styling for Component container
type=object or array

7)icon:
displays a centered icon (when no title) or to the left (with text). (can be used along with iconRight as well). Can be an object or a custom component.
type:element

8)iconContainerStyle:
styling for Icon Component container
type=object or array
9)iconRight:
displays Icon to the right of title. Needs to be used along with icon prop
type=element
10)loading:
prop to display a loading spinner
type=boolean
11)loadingProps:
add additional props for ActivityIndicator component
type=object,
12)loadingStyle:
add additional styling for loading component
type=object or array
13)title:
button title
type=string,
14)titleStyle:
add additional styling for title component
type=object or array
15)disabled:
disables user interaction
type=boolean,
16)backgroundColor:
give background color to button
type=string
17)raised:
gives little elevation effect
type=boolean
