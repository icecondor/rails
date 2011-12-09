Icecondor::Application.routes.draw do
  resource :session
  
  match "/dashboard/livemap" => "dashboard#map"
  match "/dashboard/features" => "dashboard#features"
  match "/dashboard/developers" => "dashboard#developers"
  
  root :to => 'dashboard#map'
end
