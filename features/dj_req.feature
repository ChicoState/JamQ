Feature: DJ Registartion

  Scenario: Correct passwords given.
    Given A correct user name and password
    When Register button is clicked
    Then Make a DJ

  Scenario: Incorrect passwords given.
    Given A bad user name and password
    When Register button is clicked
    Then Throw error

