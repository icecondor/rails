Icecondor::Application.routes.draw do
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  match "/dashboard/features" => "dashboard#features"
  root :to => 'dashboard#map'
end
