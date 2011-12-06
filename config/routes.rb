Icecondor::Application.routes.draw do
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  root :to => 'dashboard#map'
end
