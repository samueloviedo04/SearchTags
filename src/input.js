import React, {useState, useEffect, useCallback, useRef} from "react"
import {getWhitelistFromServer, getValue} from "./mock"
// import Tags from "@yaireo/tagify/dist/react.tagify"

import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS

/////////////////////////////////////////////////

// Tagify settings object
const baseTagifySettings = {
  blacklist: ["xxx", "yyy", "zzz"],
  maxTags: 6,
  //backspace: "edit",
  placeholder: "type something",
  dropdown: {
    enabled: 0 // a;ways show suggestions dropdown
  }
}

// this example callback is used for all Tagify events
const callback = (e) =>
  console.log(`%c ${e.type}: `, "background:#222; color:#bada55", e.detail)

// callbacks props (for this demo, the same callback reference is assigned to every event type)
const tagifyCallbacks = {
   add: callback,
  // remove: callback,
  // input: callback,
  // edit: callback,
  // invalid: callback,
  // click: callback,
  // keydown: callback,
  // focus: callback,
  // blur: callback,
  // "edit:input": callback,
  // "edit:updated": callback,
  // "edit:start": callback,
  // "edit:keydown": callback,
  // "dropdown:show": callback,
  // "dropdown:hide": callback,
  // "dropdown:select": callback
}

// this is an example React component which implemenets Tagify within
// itself. This example is a bit elaborate, to demonstrate what's possible.
const App = () => {
  const tagifyRef = useRef()
  // just a name I made up for allowing dynamic changes for tagify settings on this component
  const [tagifySettings, setTagifySettings] = useState([])
  const [tagifyProps, setTagifyProps] = useState({})

  // on component mount
  useEffect(() => {
    setTagifyProps({loading: true})
    getWhitelistFromServer(200).then((response) => {
      setTagifyProps((lastProps) => ({
        ...lastProps,
        whitelist: response,
        showFilteredDropdown: "a",
        loading: false,
      }))
    })

    // simulate setting tags value via server request
    getValue(4).then((response) =>
      setTagifyProps((lastProps) => ({...lastProps, value: response}))
    )

    /* simulated state change where some tags were deleted
    setTimeout(
      () =>
        setTagifyProps((lastProps) =>{
            console.log(lastProps)
            return({
                ...lastProps,
                value: ["abc"],
                showFilteredDropdown: false
              })
        } ),
      5000
    )*/
  }, [])

  // merged tagify settings (static & dynamic)
  const settings = {
    ...baseTagifySettings,
    ...tagifySettings,
    callbacks: tagifyCallbacks
  }

  const onChange = useCallback((e) => {
    e.persist()
    console.log("CHANGED:", e.target.value)
  }, [])

  // access Tagify internal methods example:
  const clearAll = () => {
    tagifyRef.current && tagifyRef.current.removeAllTags()
  }

  return (
    <>
      <h2>
        <em>Crazy</em> Tags:
      </h2>
      <p>
        Wait a <em>few seconds</em> to see things happen. <br />
        <small>
          <em>(Carefully examine the source-code)</em>
        </small>
      </p>
      <button className="clearAllBtn" onClick={clearAll}>
        Clear All
      </button>
      <Tags
        tagifyRef={tagifyRef}
        settings={settings}
        value=""
        autoFocus={true}
        {...tagifyProps}
        onChange={onChange}
      />
    </>
  )
}

export default App
