# Pickles

## DESCRIPTION

Friendly IRC bot written in CoffeeScript for Node.js.

## IS IT GOOD?

Yes.

## INSTALLATION

1. Clone the repository
2. Change into the directory
3. Install the dependencies with `npm install`

## USAGE

Easy as running the command `node lib/bot.js`

## INTERACTING

Pickles is quite clever (well not really) and can respond to quite a few
triggers.

### Help

Pickles will message you privately with commands and what they do when he sees
the trigger `pickles: help`.

### Weather

Pickles will respond with the weather for now, today and tomorrow when he sees
the trigger `weather me :place`.

### Images

Pickles will respond with a random URL to an image when he sees the trigger
`image me :term`.

### GitHub

Pickles will respond with the latest commit from a GitHub repository when he
sees the trigger `commit me :user/:project`.

Pickles will respond with the latest three pull requests when he sees the
trigger `what are the pulls on :user/:project`.

### Fortune

Pickles will respond with a poorly formatted fortune when he sees the trigger
`fortune me`.

### Seen

Pickles will respond with the channel and how long ago he last saw a person
when he sees the trigger `seen :nick`.

### Roll

Pickles will respond with a random number based on a dice roll when he sees
the trigger `roll me :num` where `:num` is an optional number of sides for the
die.

### Is down for everyone or just me?

Pickles will respond with the website status when he sees the trigger
`is :domain up?`.

### Time

Pickles will respond with the time in a specific location when he sees the
trigger `what is the time in :place`

### IMDb

Pickles will respond with an IMDb link when he sees the trigger
`movie me :movie_or_tv_show`.

### That's what she said!

Pickles will respond with `that's what she said!` when he sees the following
in messages. `(it's|its|it was) (long|short|hard)`.

## CONTRIBUTE

1. Fork the repository
2. Hack on the code
3. Send a pull request
4. Party
