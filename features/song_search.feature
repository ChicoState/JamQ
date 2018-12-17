Feature: Search for a song on spotify API.

  Scenario: Searching for song.
    Given Song name
    When Finished typing
    Then Load song lists
