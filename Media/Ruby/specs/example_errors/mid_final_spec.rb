# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'
require './specs/example_errors/error_helpers'

# rubocop:disable RSpec/DescribeClass

# gradebook: a simple table with no values missing
RSpec.describe 'mid final' do
  include Basics

  describe 'handles error as expected' do
    let(:raw_table_string) do
      "
      # | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
      # | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
      # | \"Bob\"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
      # | \"Alice\" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
      # | \"Eve\"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    context 'when happy path' do
      context 'when correct program' do
        it 'executes without error' do
          expect { ErrorHelpers.scatter_plot(table, 'midterm', 'final') }
            .not_to raise_error
        end
      end
    end

    context 'when buggy program' do
      it 'raises an error' do
        expect { ErrorHelpers.scatter_plot(table, 'mid', 'final') }
          .to raise_error(RequireException)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
