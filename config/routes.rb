Icecondor::Application.routes.draw do
  resource :session
  resource :users
  resource :locations
  
  match "/dashboard/livemap" => "dashboard#map"
  match "/dashboard/features" => "dashboard#features"
  match "/dashboard/developers" => "dashboard#developers"
  match "/dashboard/signup" => "dashboard#signup"
  
  match "/oauth2/authorize" => "oauth2#authorize"
  match "/oauth2/token" => "oauth2#token"

  match "/mobile/login" => "mobile#login_form"
  match "/mobile/signup" => "mobile#signup"
  
  match "/:username" => "users#show"
  root :to => 'dashboard#map'
end
