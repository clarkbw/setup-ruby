# setup-ruby

<p align="left">
  <a href="https://github.com/actions/setup-ruby"><img alt="GitHub Actions status" src="https://github.com/actions/setup-ruby/workflows/Main%20workflow/badge.svg"></a>
</p>

This action sets up a ruby environment for use in actions by:

- optionally installing a version of ruby and adding to PATH. Note that this action only uses versions of Ruby already installed in the cache. The action will fail if no matching versions are found.
- registering problem matchers for error output

# Usage

See [action.yml](action.yml)

## Basic
```yaml
steps:
- uses: actions/checkout@master
- uses: actions/setup-ruby@v1
  with:
    ruby-version: '2.x' # Version range or exact version of a Ruby version to use, using semvers version range syntax.
- run: ruby hello.rb
```

## Matrix Testing
```yaml
jobs:
  build:
    runs-on: ubuntu-16.04
    strategy:
      matrix:
        ruby: [ '2.x', '3.x' ]
    name: Ruby ${{ matrix.ruby }} sample
    steps:
      - uses: actions/checkout@master
      - name: Setup ruby
        uses: actions/setup-ruby@v1
        with:
          ruby-version: ${{ matrix.ruby }}
          architecture: 'x64'
      - run: ruby hello.rb
```

## Publish with gem
```yaml
steps:
- uses: actions/checkout@master
- uses: actions/setup-ruby@v1
  with:
    gem-key: github
    password: ${{ github.token }} 
- name: Build Ruby Gem
  run: gem build *.gemspec
- name: Publish to GitHub Packages
  run: |
    gem push --KEY github --host https://rubygems.pkg.github.com/<username/org> *.gem
```

## Publish with bundler
```yaml
steps:
- uses: actions/checkout@master
- uses: actions/setup-ruby@v1
  with:
    registry-url: https://rubygems.pkg.github.com/<username/org>
    username: $${{ github.actor }}
    password: ${{ github.token }} 
# Using cache to speed up install https://github.com/actions/cache/blob/master/examples.md#ruby---gem
- name: Cache gems
  uses: actions/cache@v1
  with:
    path: vendor/bundle
    key: ${{ runner.os }}-gem-${{ hashFiles('**/Gemfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-gem-
- name: Bundler install
  run: |
    gem update
    gem install bundler
    bundle update --bundler
    bundle config path vendor/bundle
    bundle install --retry=3 --jobs=4
- name: Build
  run: bundle exec rake build
- name: Publish to GitHub Packages
  run: bundle exec rake release:rubygem_push
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!  See [Contributor's Guide](docs/contributors.md)
