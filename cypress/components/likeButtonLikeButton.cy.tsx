import React from 'react'
import LikeButton from '../../frontend-client/app/(main-app)/(listing)/likeButton'

describe('<LikeButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LikeButton />)
  })
})