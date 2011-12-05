module CouchRest
  module Model
    module Persistence
      module ClassMethods
        def build_from_database(doc = {}, options = {}, &block)
          src = doc[model_type_key]
          base = (src.blank? || src.camelize == self.to_s) ? self : src.constantize
          base.new(doc, options.merge(:directly_set_attributes => true), &block)
        end
      end
    end
  end
end

