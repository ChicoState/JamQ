Feature: Creating playlist.

  Scenario: Playlist needs to be made
    Given A spotify token and room number
    When It runs
    Then Make the playlist 
