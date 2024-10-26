import React, { useState, useReducer, useEffect } from "react";

const initialState = {
  data: {},
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: {
          ...state.data,
          [action.tabIndex]: action.data,
        },
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
	
	// Fetch tab content 
  const fetchTabContent = async (tabIndex) => {
		// check if data for active tab is already cached and skip fetching if its already cached
    if (state.data[tabIndex]) {
      console.log("Using cached data:", state.data[tabIndex]);
      return;
    }

    try {
      const response = await fetch(
        "https://thingproxy.freeboard.io/fetch/https://loripsum.net/api/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      // console.log("Fetched data:", data);
      dispatch({ type: "FETCH_SUCCESS", tabIndex, data });
    } catch (error) {
      console.error("Error fetching data:", error);
      dispatch({ type: "FETCH_ERROR", tabIndex, error: "Error fetching data" });
    }
  };

	// fetch data whenever active tab changes
  useEffect(() => {
    fetchTabContent(activeTab);
  }, [activeTab]);

  const tabs = ["Tab 1", "Tab 2", "Tab 3", "Tab 4"];

  return (
    <div className="container">
      {/* TODO Add tabs here */}
      <div className="container">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`tab-button ${activeTab === index ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {state.error ? (
            <p className="error">{state.error}</p>
          ) : state.data[activeTab] ? (
            <>
              <h2 className="title">Title {activeTab + 1}</h2>
              <div
                className="text"
                dangerouslySetInnerHTML={{ __html: state.data[activeTab] }}
              />
            </>
          ) : (
            <p className="loading">Loading content...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
