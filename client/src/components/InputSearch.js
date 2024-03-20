import React from "react";
import "./InputSearch.css"

const InputSearch = () => {
    return (
        <div className="search-results">
        <div className="div" height='1024px'>
          <div className="group">
            <div className="overlap-group" background-color='#201f2f' height='85px' position='relative' width='1440px'>
              <div className="text-wrapper">Campus Connect</div>
              <div className="text-wrapper-2">Menu</div>
            </div>
          </div>
          <div className="overlap">
            <div className="rectangle" />
            <div className="rectangle-2" />
            <div className="text-wrapper-3">Search: University of Central</div>
            <div className="group-2" />
            <div className="overlap-wrapper">
              <div className="div-wrapper">
                <p className="p">Don't see the results your looking for? Add it!</p>
              </div>
              <div className="overlap-group-wrapper">
                <div className="overlap-2">
                  <p className="text-wrapper-4">
                    The University of Central Arkansas aspires to be a premier learner-focused public comprehensive
                    university, a nationally recognized leader for its continuous record of excellence in undergraduate and
                    graduate education, scholarly and creative endeavors, and engagement with local, national, and global
                    communities.
                  </p>
                  <div className="text-wrapper-5">University of Central Arkansas</div>
                </div>
              </div>
              <div className="group-3">
                <div className="overlap-2">
                  <div className="text-wrapper-5">University of Central Florida</div>
                  <p className="text-wrapper-6">
                    UCF is an academic, partnership and research leader in numerous fields, such as optics and lasers,
                    modeling and simulation, engineering and computer science, business, public administration, education,
                    hospitality management, healthcare and video game design.
                  </p>
                </div>
              </div>
              <div className="search-result-box">
                <div className="result-content">
                  <p className="content-description">
                    Import content from database
                  </p>
                  <div className="content-title">Title</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InputSearch;