# When to mock

Mock only at system boundaries: external APIs, time/randomness, (sometimes) the database and the filesystem — for databases, prefer a test database over a mock.

Do not mock: your own classes/modules, internal collaborators, anything you control.

Design for mockability: dependency injection; one separately mockable function per external operation (SDK-style interface), rather than a general-purpose fetcher with conditional logic.
