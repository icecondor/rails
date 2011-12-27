class Oauth2Controller < ApplicationController
  # hardcoded android oauth2 client
  CLIENTS = [{:id => "ic", :secret => ""}]

  def authorize
    if CLIENTS.map{|h|h[:id]}.include?(params[:client_id])
      if params[:response_type] == "token"
        redirect_to params[:redirect_uri]
        return
      else
        response = {:err => "response_type must be token"}
      end
    else
       response = {:err => "unrecognized client_id"}
    end
    render :json => response
  end
end
