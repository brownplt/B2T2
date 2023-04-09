# Ruby

**This code was written and tested with Ruby 3.2.0.**

## How to Execute Tests

If you haven't already, install gems.
```
bundle install
```

Execute tests.
```
bundle rspec .
```

## How to Execute Static Type Checker (Sorbet)

For this project, we used [Sorbet](https://sorbet.org/), a `"fast, powerful type checked designed for Ruby and built by Stripe"`.

To type check.
```
bundle exec srb tc 
```
