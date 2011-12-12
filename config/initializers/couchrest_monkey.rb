module CouchRest
  module Model
    class Base < CouchRest::Document
      def initialize(attributes = {}, options = {})
        super()
        prepare_all_attributes(attributes, options)
        # set the instance's database, if provided
        self.database = options[:database] unless options[:database].nil?
        unless self['_id'] && self['_rev']
          self[self.model_type_key] = self.class.to_s.underscore
        end

        yield self if block_given?

        after_initialize if respond_to?(:after_initialize)
        run_callbacks(:initialize) { self }
      end

    end
    module Persistence
      module ClassMethods
        def build_from_database(doc = {}, options = {}, &block)
          src = doc[model_type_key]
          base = (src.blank? || src.camelize == self.to_s) ? self : src.camelize.constantize
          base.new(doc, options.merge(:directly_set_attributes => true), &block)
        end
      end
    end

    module Views
      module ClassMethods
        def view_by(*keys)
          opts = keys.pop if keys.last.is_a?(Hash)
          opts ||= {}
          ducktype = opts.delete(:ducktype)
          unless ducktype || opts[:map]
            opts[:guards] ||= []
            opts[:guards].push "(doc['#{model_type_key}'] == '#{self.to_s.underscore}')"
          end
          keys.push opts
          design_doc.view_by(*keys)
        end
      end
    end

    module DesignDoc
      module ClassMethods
        def default_design_doc
          {
            "_id" => design_doc_id,
            "language" => "javascript",
            "views" => {
              'all' => {
                'map' => "function(doc) {
                  if (doc['#{self.model_type_key}'] == '#{self.to_s.underscore}') {
                    emit(doc['_id'],1);
                  }
                }"
              }
            }
          }
        end
      end
    end
  end
end

