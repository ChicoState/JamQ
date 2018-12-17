Feature: Keep and maintain spotify playlist.

  Scenario: Playlist exists
    Given Watch data
    When Watchroom runs
    Then Make the playlist on spotify
