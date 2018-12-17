Feature: Checking if room has a playlist

  Scenario: There is a spotifytoken
    Given A spotify token
    When This runs
    Then Make playlist 

  Scenario: There isn't a spotifytoken
    Given No spotify token
    When This runs
    Then Do nothing
