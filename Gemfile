source 'http://rubygems.org'

gem 'rails', '3.2.16'
gem 'rake', '~> 10.0.4'

# Bundle edge Rails instead:
# gem 'rails',     :git => 'git://github.com/rails/rails.git'

#gem 'pg'
gem 'couchrest_model', '~> 1.1.0'
gem 'sqlite3' # to keep ActiveRecord happy
gem 'omniauth'
gem 'oauth2'
gem 'bcrypt-ruby'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.5'
  gem 'coffee-rails', '~> 3.2.2'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

group :production do
  # Use unicorn as the web server
  gem 'unicorn'
end

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test do
  # Pretty printed test output
  gem 'turn', '~> 0.8.3', :require => false
  gem 'mocha'
end
