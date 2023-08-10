import React from 'react'
import LoadingLikeButton from '../../app/(main-app)/(listing)/loadingLikeButton'

describe('<LoadingLikeButton />', () => {
  it('shows unliking when listing was already liked', () => {
    const props = {
      likeStatus: true
    }
    cy.mount(<LoadingLikeButton likeStatus = {props.likeStatus} />)
  })

  it('shows liking when listing was not liked', () => {
    const props = {
      likeStatus: false
    }
    cy.mount(<LoadingLikeButton likeStatus = {props.likeStatus} />)
  })
})