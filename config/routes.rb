Icecondor::Application.routes.draw do
  resource :session
  resources :users do
    member do
      get :data
      get :map
    end
  end
  resources :locations

  match "/dashboard/livemap" => "dashboard#map"
  match "/dashboard/features" => "dashboard#features"
  match "/dashboard/developers" => "dashboard#developers"
  match "/dashboard/signup" => "dashboard#signup"
  get "/dashboard/status"

  match "/oauth2/authorize" => "oauth2#authorize"
  match "/oauth2/token" => "oauth2#token"

  match "/mobile/login" => "mobile#login_form"
  match "/mobile/signup" => "mobile#signup"

  match "/:id" => "users#solomap"
  root :to => 'dashboard#map'
end
