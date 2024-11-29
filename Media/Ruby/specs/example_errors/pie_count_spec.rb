# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'
require './specs/example_errors/error_helpers'

# rubocop:disable RSpec/DescribeClass

# jellyAnon: a jelly bean table that contains only boolean data
RSpec.describe 'pie count' do
  include Basics

  describe 'handles error as expected' do
    let(:raw_table_string) do
      "
      # | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
      # | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
      # | true     | false | false | false | true  | false  | false | true   | false | false  |
      # | true     | false | true  | false | true  | true   | false | false  | false | false  |
      # | false    | false | false | false | true  | false  | false | false  | true  | false  |
      # | false    | false | false | false | false | true   | false | false  | false | false  |
      # | false    | false | false | false | false | true   | false | false  | true  | false  |
      # | true     | false | true  | false | false | false  | false | true   | true  | false  |
      # | false    | false | true  | false | false | false  | false | false  | true  | false  |
      # | true     | false | false | false | false | false  | true  | true   | false | false  |
      # | true     | false | false | false | false | false  | false | true   | false | false  |
      # | false    | true  | false | false | false | true   | true  | false  | true  | false  |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    context 'when happy path' do
      context 'when correct program' do
        # > showAcneProportions =
        #   function(t):
        #     pieChart(count(t, "get acne"), "value", "count")
        #   end
        # > showAcneProportions(jellyAnon)
        let(:show_acne_proportions) do
          lambda do |t|
            ErrorHelpers.pie_chart(Table.count(t, 'get acne'), 'value', 'count')
          end
        end

        it 'executes without error' do
          expect { show_acne_proportions.call(table) }
            .not_to raise_error
        end
      end
    end

    context 'when buggy program' do
      # > showAcneProportions =
      #     function(t):
      #       pieChart(count(t, "get acne"), "true", "get acne")
      #     end
      # > showAcneProportions(jellyAnon)
      let(:show_acne_proportions) do
        lambda do |t|
          ErrorHelpers.pie_chart(Table.count(t, 'get acne'), 'true', 'get acnep')
        end
      end

      it 'raises an error' do
        expect { show_acne_proportions.call(table) }
          .to raise_error(RequireException)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
