Icecondor::Application.routes.draw do
  resource :session
  resource :users
  resource :locations
  
  match "/dashboard/livemap" => "dashboard#map"
  match "/dashboard/features" => "dashboard#features"
  match "/dashboard/developers" => "dashboard#developers"
  match "/dashboard/signup" => "dashboard#signup"
  
  root :to => 'dashboard#map'
end
