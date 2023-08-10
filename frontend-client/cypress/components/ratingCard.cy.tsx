import React from 'react'
import RatingCard from '../../app/(main-app)/profile-page/ratingCard'

describe('<RatingCard />', () => {
  it('displays the correct number of stars', () => {
    const props = {
      rating: 3.2
    }  

    cy.mount(<RatingCard rating = {props.rating}/>)
  })
})