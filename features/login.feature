Feature: Login to app

  Scenario: Good login.
    Given Correct user information
    When User clicks button
    Then Sign in

  Scenario: Bad login.
    Given Incorrect user information
    When User clicks button
    Then Error
